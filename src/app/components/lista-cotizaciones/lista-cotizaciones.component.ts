import { Component } from '@angular/core';
import { Cotizacion } from '../../models/cotizacion';
import { CotizacionService } from '../../services/cotizacion.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Operacion } from '../../models/operacion';
import { OperacionService } from '../../services/operacion.service';

declare const bootstrap: any;

@Component({
  selector: 'app-listado-cotizaciones',
  standalone: false,
  templateUrl: './lista-cotizaciones.component.html',
  styleUrls: ['./lista-cotizaciones.component.css']
})
export class ListadoCotizacionesComponent {
  listCotizaciones: Operacion[] = [];
  idCotizacion: string | null;
  cotizacionForm: FormGroup;
  selectedCotizacion: any = null;
  selectedFilter: string = 'cliente';
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private _cotizacionService: OperacionService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.cotizacionForm = this.fb.group({
      nroComprobante: [''],
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      total: [''],
      estado: ['', Validators.required],
      cliente: ['', Validators.required],
      detalles: this.fb.array([]),
    });

    this.idCotizacion = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerCotizaciones();
  }

  obtenerCotizaciones(): void {
    this._cotizacionService.getOperaciones(3).subscribe({
      next: (data) => {
        this.listCotizaciones = data.reverse();  // Guardamos las cotizaciones en la lista
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al obtener las cotizaciones', 'Error');
      }
    });
  }

  marcarComoAceptado(operacion: Operacion): void {
    const operacionActualizada = {
      ...operacion,
      nuevoEstado: 'Aceptada'
    };

    this._cotizacionService.actualizarEstado(operacion._id!, operacionActualizada).subscribe({
      next: () => {
        this.toastr.success('Operación marcada como Pagada', 'Éxito');
        this.obtenerCotizaciones();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo actualizar la operación', 'Error');
      }
    });
  }

  rechazarCotizacion(operacion: Operacion): void {
    const operacionActualizada = {
      ...operacion,
      nuevoEstado: 'Rechazada'
    };

    this._cotizacionService.actualizarEstado(operacion._id!, operacionActualizada).subscribe({
      next: () => {
        this.toastr.error('Operación Anulada correctamente', 'Anulado');
        this.obtenerCotizaciones();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo anular la operación', 'Error');
      }
    });
  }

  get filteredCotizaciones(): Operacion[] {
    if (!this.searchTerm.trim()) return this.listCotizaciones;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'cliente':
        return this.listCotizaciones.filter((c) =>
          c.cliente?.nombre?.toLowerCase().startsWith(term)
        );
      case 'fecha':
        return this.listCotizaciones.filter((s) =>
          s.fechaEmision
            ? this.formatDate(s.fechaEmision).includes(term)
            : false
        );
      case 'estado':
        return this.listCotizaciones.filter((c) =>
          c.estado?.toLowerCase().startsWith(term)
        );
      default:
        return this.listCotizaciones;
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  get paginatedCotizaciones(): Operacion[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCotizaciones.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCotizaciones.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
