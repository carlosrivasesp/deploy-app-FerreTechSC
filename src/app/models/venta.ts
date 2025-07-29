import { Cliente } from "./cliente";
import { DetalleVenta } from "./detalleV";

export class Venta {
  _id?: string;
  serie: string;
  nroComprobante: string;
  fechaEmision: Date;
  fechaVenc: Date;
  tipoComprobante: string;
  igv: number;
  total: number;
  estado: string;
  moneda: string;
  servicioDelivery: boolean;
  cliente: Cliente; // ID del cliente
  metodoPago: string;
  detalles: DetalleVenta[];

  constructor(
    serie: string,
    nroComprobante: string,
    fechaEmision: Date,
    fechaVenc: Date,
    tipoComprobante: string,
    igv: number,
    total: number,
    estado: string,
    moneda: string,
    servicioDelivery: boolean,
    cliente: Cliente,
    metodoPago: string,
    detalles: DetalleVenta[] = [],
  ) {
    this.serie = serie;
    this.nroComprobante = nroComprobante;
    this.fechaEmision = fechaEmision;
    this.fechaVenc = fechaVenc;
    this.tipoComprobante = tipoComprobante;
    this.igv = igv;
    this.total = total;
    this.estado = estado;
    this.moneda = moneda;
    this.servicioDelivery = servicioDelivery;
    this.cliente = cliente;
    this.metodoPago = metodoPago;
    this.detalles = detalles;
  }
}
