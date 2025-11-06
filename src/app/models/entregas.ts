import { Operacion } from './operacion';

export class Entregas {
  _id?: string;
  operacionId: Operacion;
  direccion: string;
  distrito: string;
  estado: string;
  fechaEntrega: Date;
  costo: number;
  codigo: string;

  constructor(
    operacionId: Operacion,
    direccion: string,
    distrito: string,
    estado: string,
    fechaEntrega: Date,
    costo: number,
    codigo: string
  ) {
    this.operacionId = operacionId;
    this.direccion = direccion;
    this.distrito = distrito;
    this.estado = estado;
    this.fechaEntrega = fechaEntrega;
    this.costo = costo;
    this.codigo = codigo;
  }
}
