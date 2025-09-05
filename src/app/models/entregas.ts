import { Operacion } from './operacion';
import { Venta } from './venta';

export class Entregas {
  _id?: string;
  ventaId: Operacion;
  direccion: string;
  distrito: string;
  estado: string;
  fechaEntrega: Date;
  costo: number;

  constructor(
    ventaId: Operacion,
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
