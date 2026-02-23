import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../models/pedido';
import { PedidoService } from '../../services/pedido.service';
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
  listPedidos: Pedido[] = [];
  idPedido: string | null;
  pedidoForm: FormGroup;
  selectedPedido: any = null;
  selectedFilter: string = 'cliente';
  searchTerm: string = '';
  pedidoSeleccionado: any = null;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private _pedidoService: PedidoService,
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
      codigo: [''],
    });

    this.idPedido = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerPedidos();
  }

  obtenerPedidos(): void {
    this._pedidoService.getAllPedidos().subscribe({
      next: (data) => (this.listPedidos = data.reverse()),
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al obtener los pedidos', 'Error');
      },
    });
  }

  getEstadosDisponibles(pedido: any): string[] {
    const estadoActual = pedido.estado;
    const esDelivery = pedido.servicioDelivery;

    const transiciones: any = {
      Pendiente: ['Pagado'],

      Pagado: esDelivery ? ['En preparacion'] : ['Entregado'],

      'En preparacion': ['Listo para envio'],

      'Listo para envio': ['Enviado'],

      Enviado: ['Entregado'],

      Entregado: [],

      Cancelado: [],
    };

    return transiciones[estadoActual] || [];
  }

  puedeCancelar(pedido: any): boolean {
    const estado = pedido.estado;

    return [
      'Pendiente',
      'Pagado',
      'En preparacion',
      'Listo para envio',
    ].includes(estado);
  }

  cambiarEstado(pedido: any, nuevoEstado: string): void {
    if (pedido.estado === nuevoEstado) return;

    this._pedidoService.actualizarEstado(pedido._id!, nuevoEstado).subscribe({
      next: () => {
        this.toastr.success('Estado actualizado correctamente', 'Éxito');
        this.obtenerPedidos();
      },
      error: () => {
        this.toastr.error('No se pudo actualizar el estado', 'Error');
      },
    });
  }

  get filteredPedidos(): Pedido[] {
    if (!this.searchTerm.trim()) return this.listPedidos;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'cliente':
        return this.listPedidos.filter((p) =>
          p.cliente?.nombre?.toLowerCase().includes(term)
        );
      case 'fecha':
        return this.listPedidos.filter((p) =>
          p.fechaEmision
            ? this.formatDate(p.fechaEmision).includes(term)
            : false
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

  get paginatedPedidos(): Pedido[] {
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

  getOrdenEstados(): string[] {
    if (this.pedidoSeleccionado.servicioDelivery) {
      return ['Pagado', 'En preparacion', 'Enviado', 'Entregado'];
    } else {
      return ['Pagado', 'En preparacion', 'Entregado'];
    }
  }

  getClaseEstado(estado: string): string {
    const orden = this.getOrdenEstados();
    const indexActual = orden.indexOf(this.pedidoSeleccionado.estado);
    const indexEstado = orden.indexOf(estado);

    if (indexEstado === -1) return 'pending';
    if (indexEstado < indexActual) return 'completed';
    if (indexEstado === indexActual) return 'active';
    return 'pending';
  }

  getProgresoPorcentaje(): number {
    const estado = this.pedidoSeleccionado.estado;

    if (!this.pedidoSeleccionado.servicioDelivery) {
      switch (estado) {
        case 'Pagado':
          return 33;
        case 'En preparacion':
          return 66;
        case 'Entregado':
          return 100;
        default:
          return 0;
      }
    }

    // Con delivery
    switch (estado) {
      case 'Pagado':
        return 20;
      case 'En preparacion':
        return 40;
      case 'Listo para envio':
        return 60;
      case 'Enviado':
        return 80;
      case 'Entregado':
        return 100;
      default:
        return 0;
    }
  }
}
