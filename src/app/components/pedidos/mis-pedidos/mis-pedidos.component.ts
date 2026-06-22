import { Component, inject } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-pedidos',
  standalone: false,
  templateUrl: './mis-pedidos.component.html',
  styleUrls: ['./mis-pedidos.component.css']
})
export class MisPedidosComponent {

  private pedidoService = inject(PedidoService);

  private authService = inject(AuthService);

  pedidos: any[] = [];

  ngOnInit(): void {

    this.cargarPedidos();

  }

  cargarPedidos() {

  const idUsuario =
    this.authService.obtenerIdUsuario();

  console.log('ID USUARIO JWT:', idUsuario);

  if (!idUsuario) {
    return;
  }

  this.pedidoService
    .obtenerPedidosUsuario(idUsuario)
    .subscribe({
      next: (resp: any) => {

        console.log('PEDIDOS:', resp);

        this.pedidos = resp;

      }
    });
}
}
