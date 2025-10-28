import { Compra } from "./compra";

export class Ingreso {
_id?: string;
  tipoOperacion: string; // 'Orden de compra aprobado'
  compraId: Compra;
  cantidadTotal: number;
  fechaIngreso: Date;
  detalles: { detalleId: string; cantidadIngreso: number }[] = [];

  constructor(
    tipoOperacion: string,
    compraId: Compra,
    cantidadTotal: number,
    fechaIngreso: Date,
    detalles: { detalleId: string; cantidadIngreso: number }[]
  ) {
    this.tipoOperacion = tipoOperacion;
    this.compraId = compraId;
    this.cantidadTotal = cantidadTotal;
    this.fechaIngreso = fechaIngreso;
    this.detalles = detalles;
  }
}
  