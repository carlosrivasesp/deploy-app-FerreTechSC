import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../models/cliente';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../services/cliente.service';
import { CotizacionService } from '../../services/cotizacion.service';  // Importa el servicio
import { DetalleOperacion } from '../../models/detalleOperacion';
import { Operacion } from '../../models/operacion';
import { OperacionService } from '../../services/operacion.service';

export interface ElementoRegistrado {
  codigo: string;
  nombre: string;
  cant: number;
  precio: number;
  subtotal: number;
}

@Component({
  selector: 'app-cotizaciones',
  standalone: false,
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {

  listaProductos: Producto[] = [];
  elementosRegistrados: ElementoRegistrado[] = [];
  elementoSeleccionado: Producto | null = null;

  currentDateTime: string = '';
  searchTerm: string = '';

  precioSeleccionado: number = 0;
  cantidad: number = 1;
  subtotal: number = 0;
  total: number = 0.0;
  igv: number = 0.0;

  listClientes: Cliente[] = [];
  clienteForm: FormGroup;
  cotizacionForm: FormGroup;

  clienteSearchTerm: string = '';
  clienteSeleccionado: Cliente | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _productoService: ProductoService,
    private fb: FormBuilder, private router: Router, private toastr: ToastrService, private _clienteService: ClienteService,
    private cotizacionService: OperacionService,
    private cdr: ChangeDetectorRef
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      nroDoc: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      estado: ['Activo']
    });

    this.cotizacionForm = this.fb.group({
      nroComprobante: [''],
      fechaEmision: [this.getTodayString(), Validators.required],
      fechaVenc: [this.getTodayString(), Validators.required],
      total: ['', Validators.required],
      estado: ['Pendiente', Validators.required],
      cliente: ['', Validators.required],
      detalles: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateDateTime();
      setInterval(() => this.updateDateTime(), 1000);
    }
    this.obtenerProductos();
    this.obtenerClientes();
  }

  obtenerProductos() {
    this._productoService.getAllProductos().subscribe({
      next: (data) => this.listaProductos = data,
      error: (err) => console.error('Error al obtener productos:', err)
    });
  }

  obtenerClientes() {
    this._clienteService.getAllClientes().subscribe({
      next: (data) => this.listClientes = data,
      error: (err) => console.error('Error al obtener clientes:', err)
    });
  }
  
  registrarCliente() {
    const CLIENTE: Cliente = {
      nombre: this.clienteForm.get('nombre')?.value,
      tipoDoc: this.clienteForm.get('tipoDoc')?.value,
      nroDoc: this.clienteForm.get('nroDoc')?.value,
      telefono: this.clienteForm.get('telefono')?.value,
      correo: this.clienteForm.get('correo')?.value,
      estado: this.clienteForm.get('estado')?.value
    };
    this._clienteService.guardarCliente(CLIENTE).subscribe(data => {
      this.toastr.success('El Cliente fue registrado exitosamente', 'Cliente registrado');
      this.router.navigate(['/new-cotizaciones']);
      this.obtenerClientes();
    }, error => {
      console.log(error);
      this.clienteForm.reset();
    });
  }

  get filteredProductos(): Producto[] {
    if (!this.searchTerm.trim()) return [];
    const term = this.searchTerm.trim().toLowerCase();
    return this.listaProductos.filter(p =>
      p.stockActual > 0 &&
      (p.nombre.toLowerCase().startsWith(term) || p.codInt.startsWith(term))
    );
  }

  get filteredClientes(): Cliente[] {
    if (!this.clienteSearchTerm.trim()) {
      return [];
    }
    const term = this.clienteSearchTerm.trim().toLowerCase();
    return this.listClientes.filter(p =>
      p.nombre.toLowerCase().startsWith(term) ||
      p.nroDoc.toLowerCase().startsWith(term)
    );
  }

  onSelectCliente(cliente: Cliente): void {
    this.clienteSearchTerm = `${cliente.nroDoc} - ${cliente.nombre}`;
    this.clienteSeleccionado = cliente;
    this.cotizacionForm.controls['cliente'].setValue(cliente._id);
    console.log('Cliente seleccionado:', this.cotizacionForm.controls['cliente'].value)

    const dropdownInput = document.getElementById('dropdownCliente');
    if (dropdownInput && (window as any).bootstrap) {
      const dropdownInstance = new (window as any).bootstrap.Dropdown(dropdownInput);
      dropdownInstance.hide();
    }
  }

  onClienteInputChange(valor: string): void {
    if (!valor.trim()) {
      this.clienteSeleccionado = null;
    }
  }

  clearClienteSearch(): void {
    this.clienteSearchTerm = '';
    this.clienteSeleccionado = null;
  }

  onSelectProducto(producto: Producto): void {
    this.precioSeleccionado = producto.precio;
    this.elementoSeleccionado = producto;
    this.searchTerm = `${producto.codInt} - ${producto.nombre}`; // ← importante
    this.onValueSubTotal();

    // Opcional: cerrar dropdown si usas Bootstrap
    const dropdownInput = document.getElementById('dropdownInput');
    if (dropdownInput && (window as any).bootstrap) {
      const dropdownInstance = new (window as any).bootstrap.Dropdown(dropdownInput);
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

  resetFormulario(): void {
    this.clienteForm.reset();
  }

  onValueSubTotal(): void {
    this.subtotal = parseFloat((this.precioSeleccionado * this.cantidad).toFixed(2));
  }

  onRegisterElement(): void {
  if (!this.elementoSeleccionado) return;

  const producto = this.elementoSeleccionado;
  const existente = this.elementosRegistrados.find(e => e.codigo === producto.codInt);

  if (existente) {
    existente.cant += this.cantidad;
    existente.subtotal = parseFloat((existente.cant * existente.precio).toFixed(2));
  } else {
    this.elementosRegistrados.push({
        codigo: producto.codInt,
        nombre: producto.nombre,
        cant: this.cantidad,
        precio: producto.precio,
        subtotal: this.cantidad * producto.precio
      });
    };
    this.actualizarTotalYIgv();
    this.clearSearch();
  }

  private actualizarTotalYIgv(): void {
    const subtotalTotal = this.elementosRegistrados.reduce((sum, el) => sum + el.subtotal, 0);
    
    this.igv = parseFloat((subtotalTotal * 0.18).toFixed(2));

    this.total = parseFloat((subtotalTotal + this.igv).toFixed(2));

    this.cotizacionForm.patchValue({ total: this.total, igv: this.igv });
  }

onGenerarCotizacion(): void {
    if (!this.clienteSeleccionado || this.elementosRegistrados.length === 0) {
      this.toastr.error('Debe seleccionar un cliente y agregar al menos un producto.', 'Error');
      return;
    }

    const form = this.cotizacionForm.value;

    const detalles: DetalleOperacion[] = this.elementosRegistrados.map(item => {
      const producto = this.listaProductos.find(p => p.codInt === item.codigo);
      return new DetalleOperacion(
        {} as any,
        producto!,
        item.codigo,
        item.nombre,
        item.cant,
        item.precio,
        item.subtotal
      );
    });

    const nuevaCotizacion: Operacion = {
      tipoOperacion: 3, // Cotización
      nroComprobante: form.nroComprobante,
      fechaEmision: new Date(),
      fechaVenc: new Date(),
      igv: this.igv,
      total: this.total,
      estado: 'Pendiente',
      cliente: form.cliente,
      detalles: detalles
    };

    this.cotizacionService.registrarCotizacion(nuevaCotizacion).subscribe({
      next: () => {
        this.toastr.success('Cotización registrada correctamente', 'Éxito');
        this.router.navigate(['/lista-cotizaciones']);
      },
      error: (err) => {
        console.error('Error al registrar cotización:', err);
        this.toastr.error('Error al registrar cotización', 'Error');
      }
    });
}
  private updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
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
    if(p.cant<=0){
        this.toastr.info('La cantidad mínima es 1');
        p.cant=1;
    }
    p.subtotal = p.cant * p.precio;
    this.actualizarTotalYIgv();
  }


  eliminarElemento(codigo: string): void {
      this.elementosRegistrados = this.elementosRegistrados.filter(e => e.codigo !== codigo);
      this.total = this.elementosRegistrados.reduce((sum, el) => sum + el.subtotal, 0);
      this.actualizarTotalYIgv();
      this.cdr.detectChanges();
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

  private getTodayString(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');  // Añade un cero al inicio si el día es menor a 10
    const month = String(today.getMonth() + 1).padStart(2, '0');  // `getMonth()` es cero-indexado, por eso sumamos 1
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;  // DD-MM-YYYY
  }

}
