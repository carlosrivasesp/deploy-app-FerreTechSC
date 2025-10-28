import { Operacion } from './operacion';

export class Salida {
  _id? : string;
      tipoOperacion : string;
      pedidoId : Operacion;
      cantidadTotal : number;
      fechaSalida : Date;
      detalles: { detalleId: string; cantidadSalida: number }[] = [];
  
      constructor(tipoOperacion : string,
        pedidoId : Operacion,
        cantidadTotal : number,
        fechaSalida : Date,
        detalles: { detalleId: string; cantidadSalida: number }[]) {
  
        this.tipoOperacion = tipoOperacion;
        this.pedidoId = pedidoId;
        this.cantidadTotal = cantidadTotal;
        this.fechaSalida = fechaSalida;
        this.detalles = detalles;
      }
}
