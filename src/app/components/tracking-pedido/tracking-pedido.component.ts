import { Component } from '@angular/core';

@Component({
  selector: 'app-tracking-pedido',
  standalone: false,
  templateUrl: './tracking-pedido.component.html',
  styleUrls: ['./tracking-pedido.component.css'],
})
export class TrackingPedidoComponent {
  codigoPedido: string = '';
  pedidoEncontrado: any = null;
  pedidoNoEncontrado: boolean = false;
  progreso: number = 0;
  indiceEstado: number = 0;

  // Estados con íconos de Bootstrap
  estados = [
    { nombre: 'Recibido', icono: 'bi bi-inbox' },
    { nombre: 'En Preparación', icono: 'bi bi-gear' },
    { nombre: 'Enviado', icono: 'bi bi-truck' },
    { nombre: 'Entregado', icono: 'bi bi-check-circle' },
  ];

  pedidosMock = [
    { codigo: 'FT123', cliente: 'Juan Pérez', estado: 'En Preparación', fechaEntrega: '28/10/2025' },
    { codigo: 'FT456', cliente: 'María Gómez', estado: 'Entregado', fechaEntrega: '23/10/2025' },
    { codigo: 'FT789', cliente: 'Luis Ramírez', estado: 'Enviado', fechaEntrega: '30/10/2025' },
    { codigo: 'FT001', cliente: 'Ana Torres', estado: 'Recibido', fechaEntrega: '02/11/2025' },
  ];

  buscarPedido() {
    const encontrado = this.pedidosMock.find(
      (p) => p.codigo.toLowerCase() === this.codigoPedido.toLowerCase()
    );

    if (encontrado) {
      this.pedidoEncontrado = encontrado;
      this.pedidoNoEncontrado = false;
      this.actualizarProgreso(encontrado.estado);
    } else {
      this.pedidoEncontrado = null;
      this.pedidoNoEncontrado = true;
    }
  }

  actualizarProgreso(estado: string) {
    const index = this.estados.findIndex((e) => e.nombre === estado);
    this.indiceEstado = index + 1;

    switch (estado) {
      case 'Recibido':
        this.progreso = 25;
        break;
      case 'En Preparación':
        this.progreso = 50;
        break;
      case 'Enviado':
        this.progreso = 75;
        break;
      case 'Entregado':
        this.progreso = 100;
        break;
      default:
        this.progreso = 0;
    }
  }
}
