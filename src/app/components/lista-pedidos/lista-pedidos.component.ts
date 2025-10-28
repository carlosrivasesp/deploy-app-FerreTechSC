import { Component, OnInit } from '@angular/core';
import { Operacion } from '../../models/operacion';
import { OperacionService } from '../../services/operacion.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lista-pedidos',
  standalone: false,
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.css'],
})
export class ListaPedidosComponent implements OnInit {
  listPedidos: Operacion[] = [];
  idPedido: string | null;
  pedidoForm: FormGroup;
  selectedPedido: any = null;
  selectedFilter: string = 'cliente';
  searchTerm: string = '';

  estadosDisponibles: string[] = ['Pagado', 'En preparación', 'Enviado', 'Entregado', 'Cancelado'];


  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private _operacionService: OperacionService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.pedidoForm = this.fb.group({
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      total: [''],
      estado: ['', Validators.required],
      cliente: [''],
      detalles: this.fb.array([]),
      codigo: ['']
    });

    this.idPedido = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerPedidos();
  }

  obtenerPedidos(): void {
    this._operacionService.getAllOperaciones(1).subscribe({
      next: (data) => (this.listPedidos = data.reverse()),
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al obtener los pedidos', 'Error');
      },
    });
  }

  getEstadosDisponibles(estadoActual: string): string[] {
    switch (estadoActual) {
      case 'Pagado':
        return ['En preparación'];
      case 'En preparación':
        return ['Enviado'];
      case 'Enviado':
        return ['Entregado'];
      case 'Entregado':
      case 'Cancelado':
        return [];
      default:
        return [];
    }
  }

  puedeCancelar(estadoActual: string): boolean {
    return estadoActual === 'Pagado';
  }

  cambiarEstado(pedido: any, nuevoEstado: string): void {
    if (pedido.estado === nuevoEstado) return;

    this._operacionService.actualizarEstado(pedido._id!, nuevoEstado).subscribe({
      next: () => {
        this.toastr.success('Estado actualizado correctamente', 'Éxito');
        this.obtenerPedidos();
      },
      error: () => {
        this.toastr.error('No se pudo actualizar el estado', 'Error');
      }
    });
  }


  get filteredPedidos(): Operacion[] {
    if (!this.searchTerm.trim()) return this.listPedidos;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'cliente':
        return this.listPedidos.filter((p) =>
          p.cliente?.nombre?.toLowerCase().includes(term)
        );
      case 'fecha':
        return this.listPedidos.filter((p) =>
          p.fechaEmision ? this.formatDate(p.fechaEmision).includes(term) : false
        );
      case 'estado':
        return this.listPedidos.filter((p) =>
          p.estado.toLowerCase().includes(term)
        );
      default:
        return this.listPedidos;
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  get paginatedPedidos(): Operacion[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPedidos.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPedidos.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
