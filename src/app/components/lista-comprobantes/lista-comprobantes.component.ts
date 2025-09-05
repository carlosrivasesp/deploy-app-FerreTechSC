import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Operacion } from '../../models/operacion';
import { OperacionService } from '../../services/operacion.service';

@Component({
  selector: 'app-lista-comprobantes',
  standalone: false,
  templateUrl: './lista-comprobantes.component.html',
  styleUrls: ['./lista-comprobantes.component.css'],
})
export class ListaComprobantesComponent implements OnInit {
  listVentas: Operacion[] = [];
  idVenta: string | null;
  ventaForm: FormGroup;
  selectedVenta: any = null;
  selectedFilter: string = 'cliente';
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private _ventaService: OperacionService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.ventaForm = this.fb.group({
      tipoComprobante: [''],
      serie: [''],
      nroComprobante: [''],
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      total: [''],
      estado: ['', Validators.required],
      moneda: [''],
      tipoCambio: [''],
      cliente: [''],
      metodoPago: ['', Validators.required],
      detalles: this.fb.array([]),
    });
    
    this.idVenta = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerVentas();
  }

  obtenerVentas(): void {
    this._ventaService.getOperaciones(1).subscribe({
      next: (data) => (this.listVentas = data.reverse()),
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al obtener las ventas', 'Error');
      },
    });
  }

  marcarComoPagado(operacion: Operacion): void {
    const operacionActualizada = {
      ...operacion,
      nuevoEstado: 'Pagado'
    };

    this._ventaService.actualizarEstado(operacion._id!, operacionActualizada).subscribe({
      next: () => {
        this.toastr.success('Operación marcada como Pagada', 'Éxito');
        this.obtenerVentas();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo actualizar la operación', 'Error');
      }
    });
  }

  anularOperacion(operacion: Operacion): void {
    const operacionActualizada = {
      ...operacion,
      nuevoEstado: 'Anulado'
    };

    this._ventaService.actualizarEstado(operacion._id!, operacionActualizada).subscribe({
      next: () => {
        this.toastr.error('Operación Anulada correctamente', 'Anulado');
        this.obtenerVentas();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo anular la operación', 'Error');
      }
    });
  }

  get filteredVentas(): Operacion[] {
    if (!this.searchTerm.trim()) return this.listVentas;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'cliente':
        return this.listVentas.filter((v) =>
          v.cliente?.nombre?.toLowerCase().startsWith(term)
        );
      case 'fecha':
        return this.listVentas.filter((s) =>
          s.fechaEmision
            ? this.formatDate(s.fechaEmision).includes(term)
            : false
        );
      case 'estado':
        return this.listVentas.filter((v) =>
          v.estado?.toLowerCase().startsWith(term)
        );
      default:
        return this.listVentas;
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  get paginatedVentas(): Operacion[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredVentas.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredVentas.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
