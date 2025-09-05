import { Cliente } from "./cliente";
import { DetalleOperacion } from "./detalleOperacion";
import { Proveedor } from "./proveedor";

export class Operacion {
  _id?: string;
  tipoOperacion: number;
  tipoComprobante?: string;
  nroComprobante?: string;
  serie?: string;
  detalles?: DetalleOperacion[];
  metodoPago?: string;
  servicioDelivery?: boolean;
  cliente?: Cliente; 
  proveedor?: Proveedor;
  igv?: number;
  total?: number;
  estado?: string;
  fechaEmision?: Date;
  fechaVenc?: Date;

  constructor(
    tipoOperacion: number,
    tipoComprobante?: string,
    nroComprobante?: string,
    serie?: string,
    detalles?: DetalleOperacion[],
    metodoPago?: string,
    servicioDelivery?: boolean,
    cliente?: Cliente,
    proveedor?: Proveedor,
    igv?: number,
    total?: number,
    estado?: string,
    fechaEmision?: Date,
    fechaVenc?: Date,
  ) {
      this.tipoOperacion = tipoOperacion;
      this.tipoComprobante = tipoComprobante;
      this.nroComprobante = nroComprobante;
      this.serie = serie;
      this.detalles = detalles;
      this.metodoPago = metodoPago;
      this.servicioDelivery = servicioDelivery;
      this.cliente = cliente;
      this.proveedor = proveedor;
      this.igv = igv;
      this.total = total;
      this.estado = estado;
      this.fechaEmision = fechaEmision;
      this.fechaVenc = fechaVenc;
    }
}
