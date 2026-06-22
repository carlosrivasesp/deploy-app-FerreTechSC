import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-detalle-pedido',
  standalone: false,
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})
export class DetallePedidoComponent {
  
  private route = inject(ActivatedRoute);

  private pedidoService = inject(PedidoService);

  cabecera: any = null;

  detalle: any[] = [];

  ngOnInit(): void {

    const idPedido =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.pedidoService
      .obtenerPedidoPorId(idPedido)
      .subscribe({

        next: (resp: any) => {

          console.log('RESPUESTA PEDIDO:', resp);

          this.cabecera = resp.pedido;

          this.detalle = resp.detalle;

        },

        error: (error) => {

          console.error(error);

        }

      });

  }
}
