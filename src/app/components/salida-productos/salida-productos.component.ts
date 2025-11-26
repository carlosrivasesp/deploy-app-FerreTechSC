import { Component } from '@angular/core';
import { Salida } from '../../models/salida';
import { SalidaService } from '../../services/salida.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OperacionService } from '../../services/operacion.service';
import { Operacion } from '../../models/operacion';

@Component({
  selector: 'app-salida-productos',
  standalone: false,
  templateUrl: './salida-productos.component.html',
  styleUrl: './salida-productos.component.css',
})
export class SalidaProductosComponent {
  listSalidas: Salida[] = [];
  pedidosEnviados: Operacion[] = [];
  salidaForm!: FormGroup;

  selectedFilter: string = 'nro pedido';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  salidaSeleccionada: any = null;

  constructor(
    private _salidaService: SalidaService,
    private _pedidoService: OperacionService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}
  todayString!: string;

  ngOnInit(): void {
    this.obtenerSalidas();
    this.obtenerPedidosEnviados();
    this.inicializarFormulario();

    this.todayString = this.getTodayString();
  }

  private getTodayString(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}/${month}/${year}`; // DD/MM/YYYY
  }

  inicializarFormulario() {
    this.salidaForm = this.fb.group({
      pedidoId: ['', Validators.required],
      detalles: this.fb.array([]),
      cantidadTotal: [{ value: 0, disabled: true }],
    });
  }

  get detalles(): FormArray {
    return this.salidaForm.get('detalles') as FormArray;
  }

  obtenerPedidosEnviados() {
    this._pedidoService.getAllOperaciones(1).subscribe(
      (data: Operacion[]) => {
        this.pedidosEnviados = data.filter((p) => {
          return (
            (p.estado === 'Enviado' || p.estado === 'Entregado') &&
            (!p.salidas || p.salidas.length === 0)
          );
        });
      },
      (error) => console.error('Error al obtener pedidos enviados:', error)
    );
  }

  obtenerSalidas() {
    this._salidaService.getAllSalidas().subscribe(
      (data) => {
        this.listSalidas = data.reverse();
      },
      (error) => console.error(error)
    );
  }

  onPedidoChange(event: any) {
    const pedidoId = event.target.value;
    const pedido = this.pedidosEnviados.find((p) => p._id === pedidoId);

    this.detalles.clear();
    if (pedido && pedido.detalles) {
      pedido.detalles.forEach((d) => {
        this.detalles.push(
          this.fb.group({
            producto: [d.producto.nombre],
            cantidadPedido: [d.cantidad],
            cantidadSalida: [
              d.cantidad,
              [
                // salida completa por defecto
                Validators.required,
                Validators.min(0),
                Validators.max(d.cantidad), // ✅ no puede superar lo pedido
              ],
            ],
            detalleId: [d._id],
          })
        );
      });

      const total = pedido.detalles.reduce((sum, d) => sum + d.cantidad, 0);
      this.salidaForm.get('cantidadTotal')?.setValue(total);
    }
  }

  calcularCantidadTotal() {
    const total = this.detalles.controls.reduce((sum, control) => {
      return sum + (control.get('cantidadSalida')?.value || 0);
    }, 0);
    this.salidaForm.get('cantidadTotal')?.setValue(total);
  }

  registrarSalida() {
    if (this.salidaForm.invalid) {
      this.toastr.warning('Complete los campos correctamente');
      return;
    }

    const fechaSalida = new Date();

    const salidaData = {
      tipoOperacion: 'Pedido despachado',
      pedidoId: this.salidaForm.get('pedidoId')?.value,
      cantidadTotal: this.salidaForm.get('cantidadTotal')?.value,
      detalles: this.detalles.controls.map((c) => ({
        detalleId: c.get('detalleId')?.value,
        cantidadSalida: c.get('cantidadSalida')?.value,
      })),
    };

    this._salidaService.registrarSalida(salidaData).subscribe({
      next: () => {
        this.toastr.success('Salida registrada correctamente');
        this.obtenerSalidas();
        this.resetFormulario();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err.error.message || 'Error al registrar salida');
      },
    });
  }

  resetFormulario() {
    this.salidaForm.reset();
    this.detalles.clear();
  }

  verDetalles(salida: Salida) {
    this._salidaService.obtenerSalida(salida._id!).subscribe((data) => {
      this.salidaSeleccionada = data;
      console.log('DETALLES:', this.salidaSeleccionada);
    });
  }

  get filteredSalidas(): Salida[] {
    if (!this.searchTerm.trim()) return this.listSalidas;
    const term = this.searchTerm.trim().toLowerCase();

    switch (this.selectedFilter) {
      case 'nro pedido':
        return this.listSalidas.filter((i) =>
          i.pedidoId.nroOperacion.toString().startsWith(term)
        );
      case 'fecha salida':
        return this.listSalidas.filter((s) =>
          s.fechaSalida ? this.formatDate(s.fechaSalida).includes(term) : false
        );
      default:
        return this.listSalidas;
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  }

  get paginated(): Salida[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSalidas.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSalidas.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
