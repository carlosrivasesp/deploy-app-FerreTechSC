import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from '../../../services/pedido.service';

import { CorreoService } from '../../../services/correo.service';
@Component({
  selector: 'app-detalle-pedido',
  standalone: false,
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css'],
})
export class DetallePedidoComponent {
  private route = inject(ActivatedRoute);

  private pedidoService = inject(PedidoService);

  private correoService = inject(CorreoService);

  cabecera: any = null;

  detalle: any[] = [];

  archivoSeleccionado: File | null = null;

  ngOnInit(): void {
    const idPedido = Number(this.route.snapshot.paramMap.get('id'));

    this.pedidoService.obtenerPedidoPorId(idPedido).subscribe({
      next: (resp: any) => {
        console.log('RESPUESTA PEDIDO:', resp);

        this.cabecera = resp.pedido;

        this.detalle = resp.detalle;
      },

      error: (error) => {
        console.error(error);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const archivo = input.files[0];

    const tiposPermitidos = ['image/jpeg', 'image/png'];

    if (!tiposPermitidos.includes(archivo.type)) {
      alert('Solo se permiten archivos JPG o PNG.');

      return;
    }

    this.archivoSeleccionado = archivo;
  }

  reenviarEvidencia(): void {
    if (!this.archivoSeleccionado) {
      return;
    }

    this.correoService
      .enviarEvidencia(this.cabecera.NroPedido, this.archivoSeleccionado)
      .subscribe({
        next: () => {
          this.pedidoService
            .actualizarEstadoPago(
              this.cabecera.NroPedido,
              'PENDIENTE_VALIDACION',
            )
            .subscribe({
              next: () => {
                this.cabecera.EstadoPago = 'PENDIENTE_VALIDACION';

                this.archivoSeleccionado = null;

                alert('Nueva evidencia enviada correctamente.');
              },

              error: (error) => {
                console.error(error);

                alert(
                  'La evidencia fue enviada pero no se pudo actualizar el estado del pedido.',
                );
              },
            });
        },

        error: (error) => {
          console.error(error);

          alert('No se pudo enviar la evidencia.');
        },
      });
  }
}
