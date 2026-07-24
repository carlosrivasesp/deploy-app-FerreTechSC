import { Component, inject } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { CarritoService } from '../../services/carrito.service';
//import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { CorreoService } from '../../services/correo.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);

  private pedidoService = inject(PedidoService);

  private carritoService = inject(CarritoService);

  //private authService = inject(AuthService);

  private correoService = inject(CorreoService);

  carrito = this.carritoService.obtenerCarrito();

  clienteExiste = false;

  archivoSeleccionado: File | null = null;

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
    //const idUsuario = this.authService.obtenerIdUsuario();

    const request = {
      //idUsuario,
      cliente: {
        tipoCliente: this.form.value.tipoCliente,

        nombre: this.form.value.nombre,

        tipoDocumento: this.form.value.tipoDocumento,

        nroDocumento: this.form.value.nroDocumento,

        telefono: this.form.value.telefono,

        correo: this.form.value.correo,
      },

      servicioDelivery: this.form.value.servicioDelivery,

      direccionEntrega: this.form.value.direccionEntrega,

      distrito: this.form.value.distrito,

      observacion: this.form.value.observacion,

      metodoPago: this.form.value.metodoPago,

      evidenciaPago: this.form.value.evidenciaPago,

      productos: this.carrito.map((x: any) => ({
        idPresentacionVenta: x.IdPresentacionVenta,
        cantidad: x.cantidad,
      })),
    };

    this.pedidoService.crearPedido(request).subscribe({
      next: (resp: any) => {
        if (this.archivoSeleccionado) {
          this.correoService
            .enviarEvidencia(resp.nroPedido, this.archivoSeleccionado)
            .subscribe({
              next: () => {
                alert(`Pedido generado N° ${resp.nroPedido}`);

                this.carritoService.vaciarCarrito();
              },

              error: (error) => {
                console.error(error);

                alert(
                  `El pedido ${resp.nroPedido} fue registrado, pero ocurrió un error al enviar la evidencia .`,
                );
              },
            });
        } else {
          alert(`Pedido generado N° ${resp.nroPedido}`);

          this.carritoService.vaciarCarrito();
        }
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  buscarCliente() {
    const documento = this.form.value.nroDocumento;

    if (!documento) {
      return;
    }

    this.pedidoService.obtenerClientePorDocumento(documento).subscribe({
      next: (cliente: any) => {
        if (!cliente) {
          this.clienteExiste = false;

          return;
        }

        this.clienteExiste = true;

        this.form.patchValue({
          nombre: cliente.Nombre,

          telefono: cliente.Telefono,

          correo: cliente.Correo,

          tipoDocumento: cliente.TipoDocumento,
        });
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const archivo = input.files[0];

    const tiposPermitidos = ['image/jpeg', 'image/png'];

    if (!tiposPermitidos.includes(archivo.type)) {
      alert('Solo se permiten archivos JPG o PNG.');

      input.value = '';

      this.archivoSeleccionado = null;

      return;
    }

    this.archivoSeleccionado = archivo;

    console.log('Archivo seleccionado:', this.archivoSeleccionado.name);
  }
}
