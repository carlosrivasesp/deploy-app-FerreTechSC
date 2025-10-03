import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperacionService } from '../../services/operacion.service';
import { ClienteService } from '../../services/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detalle-pedidos',
  standalone: false,
  templateUrl: './detalle-pedidos.component.html',
  styleUrls: ['./detalle-pedidos.component.css'],
})
export class DetallePedidosComponent implements OnInit {
  pedidoForm: FormGroup;
  listClientes: any[] = [];
  idPedido: string | null;

  constructor(
    private fb: FormBuilder,
    private aRouter: ActivatedRoute,
    private operacionService: OperacionService,
    private clienteService: ClienteService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.pedidoForm = this.fb.group({
      fechaEmision: [{ value: '', disabled: true }],
      fechaVenc: [{ value: '', disabled: true }],
      total: ['', Validators.required],
      estado: ['', Validators.required],
      cliente: [''],
      servicioDelivery: false,
      detalles: this.fb.array([]),
    });

    this.idPedido = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerClientes();
    this.verDetallePedido();
  }

  obtenerClientes(): void {
    this.clienteService.getAllClientes().subscribe({
      next: (data) => (this.listClientes = data),
      error: (err) => console.error(err),
    });
  }

  get detalles(): FormArray {
    return this.pedidoForm.get('detalles') as FormArray;
  }

  verDetallePedido(): void {
    if (!this.idPedido) return;

    this.operacionService.obtenerOperacion(this.idPedido).subscribe({
      next: (data) => {
        console.log('Pedido:', data);

        this.pedidoForm.patchValue({
          fechaEmision: this.formatDate(data.fechaEmision),
          fechaVenc: this.formatDate(data.fechaVenc),
          total: data.total,
          estado: data.estado,
          servicioDelivery: data.servicioDelivery,
          cliente: data.cliente?.id,
        });

        const detallesArray = this.detalles;
        detallesArray.clear();

        data.detalles.forEach((detalle: any) => {
          detallesArray.push(
            this.fb.group({
              codigo: detalle.producto?.codInt || detalle.codInt,
              descripcion: detalle.producto?.nombre || detalle.nombre,
              cantidad: detalle.cantidad,
              precio: detalle.precio,
              subtotal: detalle.subtotal,
            })
          );
        });

        this.pedidoForm.disable();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo cargar el pedido', 'Error');
      },
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  }
}
