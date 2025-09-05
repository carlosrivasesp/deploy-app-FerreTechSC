import { Component } from '@angular/core';
import { Compra } from '../../models/compra';
import { CompraService } from '../../services/compra.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Operacion } from '../../models/operacion';
import { OperacionService } from '../../services/operacion.service';

@Component({
  selector: 'app-listado-compras',
  standalone: false,
  templateUrl: './listado-compras.component.html',
  styleUrl: './listado-compras.component.css'
})
export class ListadoComprasComponent {
  listCompras: Operacion[] = [];
  idCompra: string | null;
  compraForm: FormGroup;
  selectedCompra: any = null;
  selectedFilter: string = 'proveedor';
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private _compraService: OperacionService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.compraForm = this.fb.group({
      tipoComprobante: [''],
      serie: [''],
      nroComprobante: [''],
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      igv: [''],
      total: [''],
      estado: ['', Validators.required],
      moneda: [''],
      tipoCambio: [''],
      proveedor: [''],
      metodoPago: ['', Validators.required],
      detalles: this.fb.array([]),
    });
    

    this.idCompra = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerCompras();
  }

  obtenerCompras(): void {
    this._compraService.getOperaciones(2).subscribe({
      next: (data) => (this.listCompras = data.reverse()),
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al obtener las compras', 'Error');
      },
    });
  }

  marcarComoPagado(operacion: Operacion): void {
    const operacionActualizada = {
      ...operacion,
      nuevoEstado: 'Pagado'
    };

    this._compraService.actualizarEstado(operacion._id!, operacionActualizada).subscribe({
      next: () => {
        this.toastr.success('Operación marcada como Pagada', 'Éxito');
        this.obtenerCompras();
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

    this._compraService.actualizarEstado(operacion._id!, operacionActualizada).subscribe({
      next: () => {
        this.toastr.error('Operación Anulada correctamente', 'Anulado');
        this.obtenerCompras();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo anular la operación', 'Error');
      }
    });
  }

  get filteredCompras(): Operacion[] {
    if (!this.searchTerm.trim()) return this.listCompras;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'proveedor':
        return this.listCompras.filter((c) =>
          c.proveedor?.nombre?.toLowerCase().includes(term)
        );
      case 'fecha':
        return this.listCompras.filter((s) =>
          s.fechaEmision
            ? this.formatDate(s.fechaEmision).includes(term)
            : false
        );
      case 'estado':
        return this.listCompras.filter((c) =>
          c.estado?.toLowerCase().includes(term)
        );
      default:
        return this.listCompras;
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  get paginatedCompras(): Operacion[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCompras.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCompras.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
