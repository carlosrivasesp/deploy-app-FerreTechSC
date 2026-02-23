import { Pedido } from './pedido';

export class Entregas {
  _id?: string;
  pedidoId: Pedido;
  direccion: string;
  distrito: string;
  estado: string;
  fechaEntrega: Date;
  costo: number;
  codigo: string;

  constructor(
    pedidoId: Pedido,
    direccion: string,
    distrito: string,
    estado: string,
    fechaEntrega: Date,
    costo: number,
    codigo: string
  ) {
    this.pedidoId = pedidoId;
    this.direccion = direccion;
    this.distrito = distrito;
    this.estado = estado;
    this.fechaEntrega = fechaEntrega;
    this.costo = costo;
    this.codigo = codigo;
  }
}
