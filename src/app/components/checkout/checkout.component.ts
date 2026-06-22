import { Component, inject } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);

  private pedidoService = inject(PedidoService);

  private carritoService = inject(CarritoService);

  private authService = inject(AuthService);

  carrito = this.carritoService.obtenerCarrito();

  form = this.fb.group({

    tipoCliente: ['PERSONA', Validators.required],

    nombre: ['', Validators.required],

    tipoDocumento: ['DNI', Validators.required],

    nroDocumento: ['', Validators.required],

    telefono: [''],

    correo: [''],

    servicioDelivery: [false],

    direccionEntrega: [''],

    distrito: [''],

    observacion: [''],

    metodoPago: ['YAPE', Validators.required],

    evidenciaPago: [''],

  });

  crearPedido() {

    const idUsuario =
    this.authService.obtenerIdUsuario();

    const request = {
      idUsuario,
      cliente: {

        tipoCliente:
          this.form.value.tipoCliente,

        nombre:
          this.form.value.nombre,

        tipoDocumento:
          this.form.value.tipoDocumento,

        nroDocumento:
          this.form.value.nroDocumento,

        telefono:
          this.form.value.telefono,

        correo:
          this.form.value.correo

      },

      servicioDelivery:
        this.form.value.servicioDelivery,

      direccionEntrega:
        this.form.value.direccionEntrega,

      distrito:
        this.form.value.distrito,

      observacion:
        this.form.value.observacion,

      metodoPago: this.form.value.metodoPago,

      evidenciaPago: this.form.value.evidenciaPago,

      productos: this.carrito.map((x: any) => ({
        idPresentacionVenta: x.IdPresentacionVenta,
        cantidad: x.cantidad
      }))
    };

    this.pedidoService
      .crearPedido(request)
      .subscribe({

        next: (resp: any) => {

          alert(
            `Pedido generado N° ${resp.idPedido}`
          );

          this.carritoService.vaciarCarrito();

        },

        error: (error) => {

          console.error(error);

        }

      });

  }

  buscarCliente() {

  const documento =
    this.form.value.nroDocumento;

  if (!documento) {
    return;
  }

  this.pedidoService
    .obtenerClientePorDocumento(documento)
    .subscribe({

      next: (cliente: any) => {

        if (!cliente) {
          return;
        }

        this.form.patchValue({

          nombre: cliente.Nombre,

          telefono: cliente.Telefono,

          correo: cliente.Correo,

          tipoDocumento:
            cliente.TipoDocumento

        });

      }

    });

}

}
