import { Component } from '@angular/core';
import { IngresoService } from '../../services/ingreso.service';
import { Ingreso } from '../../models/ingreso';
import { OrdenCompra } from '../../models/ordenCompra'; // Asegúrate de importar OrdenCompra
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrdenCompraService } from '../../services/ordenCompra.service';

@Component({
  selector: 'app-ingreso',
  standalone: false,
  templateUrl: './ingresar-productos.component.html',
  styleUrls: ['./ingresar-productos.component.css'],
})
export class IngresarProductosComponent {
  listIngresos: Ingreso[] = [];
  comprasAprobadas: OrdenCompra[] = []; // Asegúrate de usar OrdenCompra en lugar de Compra
  ingresoForm!: FormGroup;
  ingresoSeleccionado: any = null;

  selectedFilter: string = 'nro OrdenCompra';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private _ingresoService: IngresoService,
    private _OrdenCompraService: OrdenCompraService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerIngresos();
    this.obtenerComprasAprobadas();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.ingresoForm = this.fb.group({
      compraId: ['', Validators.required],
      detalles: this.fb.array([]),
      cantidadTotal: [{ value: 0, disabled: true }],
      fechaIngreso: ['', [Validators.required, this.validarFechaNoFutura]],
    });
  }

  get detalles(): FormArray {
    return this.ingresoForm.get('detalles') as FormArray;
  }

  obtenerComprasAprobadas() {
    this._OrdenCompraService.getAllCompras().subscribe(
      (data: OrdenCompra[]) => {
        console.log('Compras Aprobadas:', data);
        this.comprasAprobadas = data.filter((c) => {
          return c.estado === 'Aprobada' && (!c.ingresos || c.ingresos.length === 0);
        });
      },
      (error) => {
        console.error('Error al obtener las compras:', error);
        this.toastr.error('Error al obtener las compras aprobadas');
      }
    );
  }

  obtenerIngresos() {
    this._ingresoService
      .getAllIngresos()
      .subscribe((data) => (this.listIngresos = data.reverse()));
  }

  onCompraChange(event: any) {
    const compraId = event.target.value;
    const OrdenCompra = this.comprasAprobadas.find((c) => c._id === compraId);

    this.detalles.clear();

    if (OrdenCompra && OrdenCompra.detalles) {
      OrdenCompra.detalles.forEach((d) => {
        this.detalles.push(
          this.fb.group({
            producto: [d.producto.nombre],
            cantidadCompra: [d.cantidad],
            cantidadIngreso: [d.cantidad], // ingreso completo
            detalleId: [d._id],
          })
        );
      });

      const total = OrdenCompra.detalles.reduce((sum, d) => sum + d.cantidad, 0);
      this.ingresoForm.get('cantidadTotal')?.setValue(total);
    }
  }

  registrarIngreso() {
    if (this.ingresoForm.invalid) {
      this.toastr.warning('Complete los campos correctamente');
      return;
    }

    let fechaIngreso = this.ingresoForm.get('fechaIngreso')?.value;
    if (fechaIngreso) {
      const fecha = new Date(fechaIngreso);
      fecha.setHours(0, 0, 0, 0);
      fechaIngreso = fecha;
    }

    const ingresoData = {
      tipoOperacion: 'Ingreso por OrdenCompra',
      compraId: this.ingresoForm.get('compraId')?.value,
      cantidadTotal: this.ingresoForm.get('cantidadTotal')?.value,
      fechaIngreso: fechaIngreso,  // Usa la fecha ajustada
      detalles: this.detalles.controls.map((c) => ({
        detalleId: c.get('detalleId')?.value,
        cantidadIngreso: c.get('cantidadIngreso')?.value,
      })),
    };

    this._ingresoService.registrarIngreso(ingresoData).subscribe({
      next: () => {
        this.toastr.success('Ingreso registrado correctamente');
        this.obtenerIngresos();
        this.resetFormulario();
      },
      error: (err) =>
        this.toastr.error(err.error.message || 'Error al registrar ingreso'),
    });
  }


  validarFechaNoFutura(control: FormControl) {
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    if (fechaSeleccionada > hoy) {
      return { fechaFutura: true };
    }
    return null;
  }

  resetFormulario() {
    this.ingresoForm.reset();
    this.detalles.clear();
  }

  get filteredIngresos(): Ingreso[] {
    if (!this.searchTerm.trim()) return this.listIngresos;
    const term = this.searchTerm.trim().toLowerCase();

    switch (this.selectedFilter) {
      case 'nro OrdenCompra':
        return this.listIngresos.filter((i) =>
          i.compraId?.codigo?.toString().startsWith(term)
        );
      case 'fecha salida':
        return this.listIngresos.filter((s) =>
          s.fechaIngreso ? this.formatDate(s.fechaIngreso).includes(term) : false
        );
      default:
        return this.listIngresos;
    }
  }


  formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  }

  verDetalles(ingreso: Ingreso) {
    this._ingresoService.obtenerIngreso(ingreso._id!).subscribe((data) => {
      this.ingresoSeleccionado = data;
      console.log('DETALLES:', this.ingresoSeleccionado);
    });
  }

  calcularCantidadTotal() {
    const total = this.detalles.controls.reduce((sum, c) => {
      return sum + Number(c.get('cantidadIngreso')?.value || 0);
    }, 0);

    this.ingresoForm.get('cantidadTotal')?.setValue(total);
  }

  get paginated(): Ingreso[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredIngresos.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredIngresos.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
