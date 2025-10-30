import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Entregas } from '../../models/entregas';
import { EntregaService } from '../../services/entregas.service';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta';
import { Operacion } from '../../models/operacion';
import { OperacionService } from '../../services/operacion.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entregas',
  standalone: false,
  templateUrl: './entregas.component.html',
  styleUrl: './entregas.component.css',
})
export class EntregasComponent {
  listaEntregas: Entregas[] = [];
  entregaSeleccionada: any = null;
  entregaForm: FormGroup;

  selectedFilter: string = 'Nro Operacion';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  direccion: string = '';
  distrito: string = 'Surco';
  fechaEntrega: string = '';
  costo: number = 0;

  constructor(
    private _entregasService: EntregaService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.entregaForm = this.fb.group({
      // Información General del Pedido
      codigoPedido: [''],
      id: [''],
      fechaActual: [''],
      fechaPedido: [''],
      fechaEstado: [''],
      estadoActual: [''],
      
      // Detalle de Pedido
      numeroPedido: [''],
      fechaRegistro: [''],
      estado: [''],
      descripcionProducto: [''],
      
      // Detalle de Cliente
      nombre: [''],
      correo: [''],
      direccion: [''],
      telefono: [''],
      tipoDocumento: [''],
      numeroDocumento: ['']
    });
  }

  ngOnInit() {
    this.obtenerEntregas();
    this.entregaSeleccionada = null;
  }

  obtenerEntregas() {
    this._entregasService.getAllEntregas().subscribe({
      next: (data) => {
        console.log('Datos recibidos del servidor:', data);
        console.log('Cantidad de registros:', data.length);
        
        // Eliminar duplicados por número de operación (si los hay)
        const uniqueEntregas = data.filter((entrega: any, index: number, self: any[]) => 
          index === self.findIndex((e: any) => e.operacionId?.nroOperacion === entrega.operacionId?.nroOperacion)
        );
        
        console.log('Entregas únicas después de filtrar duplicados:', uniqueEntregas.length);
        this.listaEntregas = uniqueEntregas.reverse();
        console.log('Lista de entregas después del reverse:', this.listaEntregas);
        console.log('Cantidad final de entregas:', this.listaEntregas.length);
      },
      error: (err) => {
        console.error('Error al obtener entregas', err);
      },
    });
  }
  cambiarEstado(entregaId: string, nuevoEstado: string) {
    const payload: any = {
      estado: nuevoEstado,
      direccion: this.direccion,
      distrito: this.distrito,
      fechaEntrega: this.fechaEntrega,
      costo: this.costo,
    };

    this._entregasService.editarEstado(entregaId, payload).subscribe({
      next: (res) => {
        if (nuevoEstado === 'En proceso') {
          this.toastr.success('Entrega programada', 'Éxito');
        } else if (nuevoEstado === 'Finalizado') {
          this.toastr.success('Entrega finalizada', 'Éxito');
        }

        const modalElement = document.getElementById('modalEdit');
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        modal?.hide();

        // Limpiar los inputs después de cerrar el modal (opcional)
        this.direccion = '';
        this.distrito = '';
        this.fechaEntrega = '';
        this.costo = 0;

        this.obtenerEntregas();
      },
      error: (err) => {
        this.toastr.error('Error al cambiar estado.', 'Error');
        console.error('Error actualizando estado', err);
        alert(err.error?.mensaje || 'Error al actualizar estado');
      },
    });
  }

  get filteredEntregas(): Entregas[] {
    if (!this.searchTerm.trim()) {
      console.log('Sin filtro - mostrando todas las entregas:', this.listaEntregas.length);
      return this.listaEntregas;
    }

    const term = this.searchTerm.toLowerCase();
    console.log('Filtrando con término:', term, 'Filtro:', this.selectedFilter);
    
    let filtered: Entregas[] = [];
    switch (this.selectedFilter) {
      case 'Estado':
        filtered = this.listaEntregas.filter((v) =>
          v.estado.toLowerCase().startsWith(term)
        );
        break;
      case 'Numero Pedido':
        filtered = this.listaEntregas.filter((v) =>
          v.operacionId.nroOperacion.toString().startsWith(term)
        );
        break;
      default:
        filtered = this.listaEntregas;
    }
    
    console.log('Resultado del filtro:', filtered.length, 'entregas');
    return filtered;
  }

  get paginatedEntregas(): Entregas[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEntregas.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEntregas.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Método para cargar datos cuando se selecciona una entrega
  cargarDatosEntrega(): void {
    // Los datos se muestran directamente en el modal usando entregaSeleccionada
    console.log('Entrega seleccionada:', this.entregaSeleccionada);
    console.log('Operación ID:', this.entregaSeleccionada?.operacionId);
    console.log('Cliente:', this.entregaSeleccionada?.operacionId?.cliente);
  }

  // Método para obtener el estado actual del pedido
  getEstadoActual(): string {
    if (!this.entregaSeleccionada) return '';
    
    const estado = this.entregaSeleccionada.estado?.toLowerCase();
    
    // Mapeo de estados de la base de datos a estados del seguimiento
    switch (estado) {
      case 'pendiente':
        return 'Recibido';
      case 'en proceso':
        return 'En Preparación';
      case 'enviado':
        return 'Enviado';
      case 'entregado':
      case 'finalizado':
        return 'Entregado';
      default:
        return 'Recibido'; // Estado por defecto
    }
  }

  // Método para verificar si un estado está completado
  isEstadoCompletado(estado: string): boolean {
    if (!this.entregaSeleccionada) return false;
    
    const estadoActual = this.getEstadoActual();
    const estados = ['Recibido', 'En Preparación', 'Enviado', 'Entregado'];
    const indiceActual = estados.indexOf(estadoActual);
    const indiceVerificar = estados.indexOf(estado);
    
    return indiceVerificar < indiceActual;
  }

  // Método para calcular el porcentaje de progreso
  getProgresoPorcentaje(): number {
    if (!this.entregaSeleccionada) return 0;
    
    const estadoActual = this.getEstadoActual();
    const estados = ['Recibido', 'En Preparación', 'Enviado', 'Entregado'];
    const indice = estados.indexOf(estadoActual);
    
    if (indice === -1) return 0;
    
    // Calcular porcentaje basado en el estado actual
    return ((indice + 1) / estados.length) * 100;
  }
}
