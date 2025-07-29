import { Venta } from './venta';

export class Entregas {
  _id?: string;
  ventaId: Venta;
  direccion: string;
  distrito: string;
  estado: string;
  fechaEntrega: Date;
  costo: number;

  constructor(
    ventaId: Venta,
    direccion: string,
    distrito: string,
    estado: string,
    fechaEntrega: Date,
    costo: number
  ) {
    this.ventaId = ventaId;
    this.direccion = direccion;
    this.distrito = distrito;
    this.estado = estado;
    this.fechaEntrega = fechaEntrega;
    this.costo = costo;
  }
}
