import { Proveedor } from "./proveedor";
import { DetalleCompra } from "./detalleC";
import { Ingreso } from "./ingreso";

export class Compra {
  _id?: string;
  serie: string;
  nroComprobante?: string;
  fechaEmision: Date;
  fechaVenc: Date;
  tipoComprobante: string;
  igv: number;
  total: number;
  estado: string;
  proveedor: Proveedor; // ID del proveedor
  metodoPago: string;
  detalles: DetalleCompra[];
  ingresos?: Ingreso[];

  constructor(
    serie: string,
    nroComprobante: string,
    fechaEmision: Date,
    fechaVenc: Date,
    tipoComprobante: string,
    igv: number,
    total: number,
    estado: string,
    proveedor: Proveedor,
    metodoPago: string,
    detalles: DetalleCompra[] = [],
    ingresos: Ingreso[]
  ) {
    this.serie = serie;
    this.nroComprobante = nroComprobante;
    this.fechaEmision = fechaEmision;
    this.fechaVenc = fechaVenc;
    this.tipoComprobante = tipoComprobante;
    this.igv = igv;
    this.total = total;
    this.estado = estado;
    this.proveedor = proveedor;
    this.metodoPago = metodoPago;
    this.detalles = detalles;
    this.ingresos = ingresos
  }
}
