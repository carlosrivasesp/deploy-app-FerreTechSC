import { Component } from '@angular/core';
import { OrdenCompra } from '../../models/ordenCompra';
import { OrdenCompraService } from '../../services/ordenCompra.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-listado-compras',
  standalone: false,
  templateUrl: './listado-compras.component.html',
  styleUrl: './listado-compras.component.css',
})
export class ListadoComprasComponent {
  listCompras: OrdenCompra[] = [];
  selectedCompra: any = null;
  selectedFilter: string = 'proveedor';
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private _compraService: OrdenCompraService,
    private toastr: ToastrService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.obtenerCompras();
  }

  obtenerCompras(): void {
    this._compraService.getAllCompras().subscribe({
      next: (data) => (this.listCompras = data.reverse()),
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al obtener las compras', 'Error');
      },
    });
  }

  cambiarEstado(compra: any, nuevoEstado: string): void {
    if (compra.estado === nuevoEstado) return;

    this._compraService.actualizarEstado(compra._id!, nuevoEstado).subscribe({
      next: () => {
        this.toastr.success('Estado actualizado correctamente', 'Éxito');
        this.obtenerCompras(); // recarga la lista
      },
      error: () => {
        this.toastr.error('No se pudo actualizar el estado', 'Error');
      },
    });
  }

  get filteredCompras(): OrdenCompra[] {
    if (!this.searchTerm.trim()) return this.listCompras;

    const term = this.searchTerm.toLowerCase();
    switch (this.selectedFilter) {
      case 'proveedor':
        return this.listCompras.filter((c) =>
          c.proveedor?.nombre?.toLowerCase().includes(term)
        );
      case 'fecha':
        return this.listCompras.filter((s) =>
          s.fechaCreacion
            ? this.formatDate(s.fechaCreacion).includes(term)
            : false
        );
      case 'estado':
        return this.listCompras.filter((c) =>
          c.estado.toLowerCase().includes(term)
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

  get paginatedCompras(): OrdenCompra[] {
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
