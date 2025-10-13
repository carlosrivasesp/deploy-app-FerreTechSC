import { Cliente } from "./cliente";
import { DetalleOperacion } from "./detalleOperacion";
import { Proveedor } from "./proveedor";
import { Salida } from "./salida";

export class Operacion {
  _id?: string;
  tipoOperacion: number; // 1 = pedido, 2 = cotización
  nroOperacion: number;
  detalles: DetalleOperacion[];
  servicioDelivery: boolean;
  cliente: Cliente; // ID del cliente
  igv: number;
  total: number;
  estado: string;
  fechaEmision: Date;
  fechaVenc: Date;
  salidas: Salida[];

  constructor(
    tipoOperacion: number,
    nroOperacion: number,
    detalles: DetalleOperacion[] = [],
    servicioDelivery: boolean,
    cliente: Cliente,
    igv: number,
    total: number,
    estado: string,
    fechaEmision: Date,
    fechaVenc: Date,
    salidas: Salida[]
  ) {
    this.tipoOperacion = tipoOperacion;
    this.nroOperacion = nroOperacion;
    this.detalles = detalles;
    this.servicioDelivery = servicioDelivery;
    this.cliente = cliente;
    this.igv = igv;
    this.total = total;
    this.estado = estado;
    this.fechaEmision = fechaEmision;
    this.fechaVenc = fechaVenc;
    this.salidas = salidas;
  }
}
