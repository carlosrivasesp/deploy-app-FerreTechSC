import { Operacion } from './operacion';

export class Entregas {
  _id?: string;
  operacionId: Operacion;
  direccion: string;
  distrito: string;
  estado: string;
  fechaEntrega: Date;
  costo: number;

  constructor(
    operacionId: Operacion,
    direccion: string,
    distrito: string,
    estado: string,
    fechaEntrega: Date,
    costo: number
  ) {
    this.operacionId = operacionId;
    this.direccion = direccion;
    this.distrito = distrito;
    this.estado = estado;
    this.fechaEntrega = fechaEntrega;
    this.costo = costo;
  }
}
