import { OrdenCompra } from "./ordenCompra"; // Importar correctamente 'OrdenCompra'

export class Ingreso {
  _id?: string;
  tipoOperacion: string; // 'Orden de compra aprobada'
  compraId: OrdenCompra; // Cambio de 'Compra' a 'OrdenCompra'
  cantidadTotal: number;
  fechaIngreso: Date;
  detalles: { detalleId: string; cantidadIngreso: number }[] = [];

  constructor(
    tipoOperacion: string,
    compraId: OrdenCompra,  // Cambiar 'Compra' por 'OrdenCompra'
    cantidadTotal: number,
    fechaIngreso: Date,
    detalles: { detalleId: string; cantidadIngreso: number }[]
  ) {
    this.tipoOperacion = tipoOperacion;
    this.compraId = compraId;  // Asegúrate de que 'compraId' sea de tipo 'OrdenCompra'
    this.cantidadTotal = cantidadTotal;
    this.fechaIngreso = fechaIngreso;
    this.detalles = detalles;
  }
}
