import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proveedor } from '../../models/proveedor';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProveedorService } from '../../services/proveedor.service';
import { OrdenCompraService } from '../../services/ordenCompra.service';

interface ElementoRegistrado {
  producto: Producto;
  codigo: string;
  nombre: string;
  cant: number;
  precio: number;
  subtotal: number;
}

@Component({
  selector: 'app-registrar-compra',
  standalone: false,
  templateUrl: './registrar-compra.component.html',
  styleUrl: './registrar-compra.component.css',
})
export class RegistrarCompraComponent {
  listaProducto: Producto[] = [];
  elementosRegistrados: ElementoRegistrado[] = [];
  elementoSeleccionado: Producto | null = null;

  currentDateTime: string = '';
  searchTerm: string = '';

  precioSeleccionado: number = 0;
  cantidad: number = 1;
  subtotal: number = 0;
  igv: number = 0.0;
  total: number = 0.0;

  listProveedores: Proveedor[] = [];
  proveedorForm: FormGroup;
  ordenCompraForm: FormGroup;

  proveedorSearchTerm: string = '';
  proveedorSeleccionado: Proveedor | null = null;
  selectedProveedor: any = null;

  serie: string = 'B01';

  constructor(
    private _productoService: ProductoService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _proveedorService: ProveedorService,
    private aRoute: ActivatedRoute,
    private _compraService: OrdenCompraService,
    private cdr: ChangeDetectorRef
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      nroDoc: ['', Validators.required],
      telefono: [{ value: '', disabled: true }, Validators.required],
      correo: [{ value: '', disabled: true }, Validators.required],
    });

    this.ordenCompraForm = this.fb.group({
      codigo: [''],
      fechaCreacion: [this.getTodayString(), Validators.required],
      total: ['', Validators.required],
      estado: ['Pendiente', Validators.required],
      proveedor: ['', Validators.required],
      detalles: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.obtenerProveedores();

    this.ordenCompraForm.get('proveedor')?.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.proveedorSearchTerm = value;
      } else {
        this.proveedorSearchTerm = '';
      }
    });
  }

  registrarCompra() {
    if (!this.selectedProveedor) {
      console.log(this.selectedProveedor);
      console.log('Formulario:', this.ordenCompraForm.value);
      return;
    }

    const form = this.ordenCompraForm.value;
    console.log('Proveedor del formulario:', form.proveedor);

    const productos = this.elementosRegistrados.map((item) => ({
      compraId: '',
      producto: item.producto,
      codInt: item.codigo,
      nombre: item.nombre,
      cantidad: item.cant,
      precio: item.precio,
      subtotal: item.subtotal,
    }));

    const nuevaCompra = {
      codigo: form.codigo,
      fechaCreacion: new Date(),
      total: this.total,
      estado: form.estado,
      proveedor: form.proveedor,
      detalles: productos,
    };
    console.log(nuevaCompra);

    this._compraService.registrarCompra(nuevaCompra).subscribe(
      () => {
        this.toastr.success('Compra registrada correctamente');
        this.router.navigate(['/listado-compras']);
      },
      (error) => {
        console.error('Error al registrar compra:', error);
        this.toastr.error('Error al registrar la compra');
      }
    );
  }

  obtenerProveedores() {
    this._proveedorService.getAllProveedores().subscribe(
      (data) => {
        this.listProveedores = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  registrarProveedor() {
    const PROVEEDOR: Proveedor = {
      nombre: this.proveedorForm.get('nombre')?.value,
      tipoDoc: this.proveedorForm.get('tipoDoc')?.value,
      nroDoc: this.proveedorForm.get('nroDoc')?.value,
      telefono: this.proveedorForm.get('telefono')?.value,
      correo: this.proveedorForm.get('correo')?.value,
      estado: this.proveedorForm.get('estado')?.value,
    };

    this._proveedorService.guardarProveedor(PROVEEDOR).subscribe(
      (data) => {
        this.toastr.success(
          'El Proveedor fue registrado exitosamente',
          'Proveedor registrado'
        );
        this.router.navigate(['/compras']);
        this.obtenerProveedores();
      },
      (error) => {
        console.log(error);
        this.proveedorForm.reset();
      }
    );
  }

  get filteredDatos(): Producto[] {
    if (!this.searchTerm.trim()) return [];
    const term = this.searchTerm.trim().toLowerCase();
    return this.listaProducto.filter(
      (p) =>
        p.nombre.toLowerCase().startsWith(term) ||
        p.codInt.toLowerCase().startsWith(term)
    );
  }

  get filteredProveedores() {
    const term = (this.proveedorSearchTerm || '').toLowerCase().trim();
    return this.listProveedores.filter(
      (p) =>
        p.nroDoc.toLowerCase().startsWith(term) ||
        p.nombre.toLowerCase().startsWith(term)
    );
  }

  onSelectProveedor(proveedor: Proveedor) {
    this.selectedProveedor = proveedor;

    if (!proveedor._id) {
      this.toastr.error('El proveedor seleccionado no tiene ID válido.');
      return;
    }

    console.log('ID proveedor enviado:', proveedor._id);

    this.ordenCompraForm.controls['proveedor'].setValue(proveedor._id);
    this.proveedorSearchTerm = proveedor.nroDoc + ' - ' + proveedor.nombre;
    console.log(
      'Proveedor seleccionado en el formulario:',
      this.ordenCompraForm.controls['proveedor'].value
    );

    this.listaProducto = [];
    this.searchTerm = '';
    this.elementoSeleccionado = null;
    this.precioSeleccionado = 0;
    this.subtotal = 0;
    this.cantidad = 1;

    this._productoService
      .getProductosPorProveedorSinStock(proveedor._id)
      .subscribe(
        (productos: Producto[]) => {
          this.listaProducto = productos;

          if (productos.length === 0) {
            this.toastr.info('No hay productos para este proveedor');
          } else {
            this.elementosRegistrados = productos.map((p) => {
              return {
                producto: p,
                codigo: p.codInt,
                nombre: p.nombre,
                cant: 30,
                precio: p.precio,
                subtotal: parseFloat((p.precio * 30).toFixed(2)),
              };
            });
            this.actualizarTotalYIgv();
          }
        },
        (error) => {
          console.error('Error al obtener productos por proveedor:', error);
          this.toastr.error('Error al obtener productos por proveedor');
        }
      );

    this._productoService.getProductosPorProveedor(proveedor._id).subscribe(
      (productos: Producto[]) => {
        this.listaProducto = productos;
      },
      (error) => {
        console.error('Error al obtener todos los productos:', error);
        this.toastr.error('Error al cargar productos del proveedor');
      }
    );
  }

  onProveedorInputChange(valor: any) {
    if (typeof valor === 'string') {
      this.proveedorSearchTerm = valor;
    } else {
      this.proveedorSearchTerm = '';
    }
  }

  clearProveedorSearch(): void {
    this.proveedorSearchTerm = '';
    this.proveedorSeleccionado = null;
  }

  resetFormulario() {
    this.proveedorForm.reset();
  }

  onSelectElement(producto: Producto): void {
    this.searchTerm = `${producto.codInt} - ${producto.nombre}`;
    this.elementoSeleccionado = producto;

    this.precioSeleccionado = producto.precio;
    this.onValueSubTotal();

    const dropdownInput = document.getElementById('dropdownInput');
    if (dropdownInput && (window as any).bootstrap) {
      const dropdownInstance = new (window as any).bootstrap.Dropdown(
        dropdownInput
      );
      dropdownInstance.hide();
    }
  }

  onElementChange(valor: string): void {
    if (!valor.trim()) {
      this.precioSeleccionado = 0;
      this.subtotal = 0;
      this.cantidad = 1;
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.precioSeleccionado = 0;
    this.elementoSeleccionado = null;
    this.subtotal = 0;
    this.cantidad = 1;
  }

  onValueSubTotal(): void {
    this.subtotal = parseFloat(
      (this.precioSeleccionado * this.cantidad).toFixed(2)
    );
    this.actualizarTotalYIgv();
  }

  private actualizarTotalYIgv(): void {
    const subtotalTotal = this.elementosRegistrados.reduce(
      (sum, el) => sum + el.subtotal,
      0
    );

    this.igv = parseFloat((subtotalTotal * 0.18).toFixed(2));

    this.total = parseFloat((subtotalTotal + this.igv).toFixed(2));

    this.ordenCompraForm.patchValue({ total: this.total, igv: this.igv });
  }

  onRegisterElement(): void {
    if (!this.elementoSeleccionado) return;

    const { codInt, nombre } = this.elementoSeleccionado;
    const precio = this.elementoSeleccionado.precio; // SIN productoProveedor

    const existente = this.elementosRegistrados.find(
      (e) => e.codigo === codInt
    );

    if (existente) {
      existente.cant += this.cantidad;
      existente.subtotal = existente.cant * precio;
    } else {
      const nuevoElemento: ElementoRegistrado = {
        producto: this.elementoSeleccionado,
        codigo: codInt,
        nombre,
        cant: this.cantidad,
        precio,
        subtotal: this.cantidad * precio,
      };

      this.elementosRegistrados.push(nuevoElemento);
    }

    this.actualizarTotalYIgv();
    this.clearSearch();
    this.cdr.detectChanges();
  }

  aumentarCantidad(item: ElementoRegistrado): void {
    item.cant++;
    item.subtotal = item.cant * item.precio;
    this.actualizarTotalYIgv();
  }

  disminuirCantidad(item: ElementoRegistrado): void {
    if (item.cant > 1) {
      item.cant--;
      item.subtotal = item.cant * item.precio;
      this.actualizarTotalYIgv();
    } else {
      this.toastr.info('La cantidad mínima es 1');
    }
  }

  actualizarSubtotal(p: any): void {
    if (p.cant <= 0) {
      this.toastr.info('La cantidad mínima es 1');
      p.cant = 1;
    }
    p.subtotal = p.cant * p.precio;
    this.actualizarTotalYIgv();
  }

  eliminarElemento(codigo: string): void {
    this.elementosRegistrados = this.elementosRegistrados.filter(
      (e) => e.codigo !== codigo
    );
    this.total = this.elementosRegistrados.reduce(
      (sum, el) => sum + el.subtotal,
      0
    );
    this.actualizarTotalYIgv();
    this.cdr.detectChanges();
  }

  private getTodayString(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}/${month}/${year}`; // DD-MM-YYYY
  }

  itemsPerPage = 5; // filas por página
  currentPage = 1;

  get paginatedDetalles(): ElementoRegistrado[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.elementosRegistrados.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.elementosRegistrados.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
