import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraService } from '../../services/compra.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor.service';
import { OrdenCompraService } from '../../services/ordenCompra.service';

@Component({
  selector: 'app-detalle-compra',
  standalone: false,
  templateUrl: './detalle-compra.component.html',
  styleUrls: ['./detalle-compra.component.css'],
})
export class DetalleCompraComponent implements OnInit {
  compraForm: FormGroup;
  listProveedores: any[] = [];
  idCompra: string | null;
  currentDateTime: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private aRouter: ActivatedRoute,
    private compraService: OrdenCompraService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private _proveedorService: ProveedorService
  ) {
    this.compraForm = this.fb.group({
      codigo: ['', Validators.required],
      estado: ['', Validators.required],
      total: ['', [Validators.required, Validators.min(0)]],
      proveedor: ['', Validators.required],
      fechaCreacion: [{ value: '', disabled: true }],
      detalles: this.fb.array([]),
    });

    this.idCompra = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateDateTime();
      setInterval(() => this.updateDateTime(), 1000);
    }

    this.obtenerProveedores();
    this.verDetalle();
  }

  obtenerProveedores() {
    this._proveedorService.getAllProveedores().subscribe(
      (data) => {
        this.listProveedores = data;
      },
      (error) => {
        console.error('Error al obtener proveedores', error);
        this.toastr.error('No se pudieron cargar los proveedores', 'Error');
      }
    );
  }

  get detalles(): FormArray {
    return this.compraForm.get('detalles') as FormArray;
  }

  verDetalle(): void {
    if (this.idCompra !== null) {
      this.compraService.obtenerCompra(this.idCompra).subscribe({
        next: (data) => {
          this.compraForm.patchValue({
            codigo: data.codigo,
            estado: data.estado,
            total: data.total,
            fechaCreacion: this.formatDate(data.fechaCreacion),
            proveedor: data.proveedor?._id || ''
          });

          this.detalles.clear();

          data.detalles.forEach((detalle: any) => {
            this.detalles.push(
              this.fb.group({
                codigo: [detalle.producto.codInt],
                descripcion: [detalle.producto.nombre],
                cantidad: [detalle.cantidad],
                precio: [detalle.precio],
                subtotal: [detalle.subtotal],
              })
            );
          });
        },
        error: (err) => {
          console.error('Error al obtener los detalles de la compra', err);
          this.toastr.error('No se pudo cargar el detalle de la compra', 'Error');
        },
      });
    }

    this.compraForm.disable();
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  }

  private updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  itemsPerPage = 5; // filas por página
  currentPage = 1;

  get paginatedDetalles(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.detalles.controls.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.detalles.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}