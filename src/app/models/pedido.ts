import { Cliente } from "./cliente";
import { DetallePedido } from "./detallePedido";
import { Proveedor } from "./proveedor";
import { Salida } from "./salida";

export class Pedido {
  _id?: string;
  nroPedido: number;
  detalles: DetallePedido[];
  servicioDelivery: boolean;
  cliente: Cliente; // ID del cliente
  igv: number;
  total: number;
  estado: string;
  fechaEmision: Date;
  fechaVenc: Date;
  salidas: Salida[];
  codigo: string;

  constructor(
    nroPedido: number,
    detalles: DetallePedido[] = [],
    servicioDelivery: boolean,
    cliente: Cliente,
    igv: number,
    total: number,
    estado: string,
    fechaEmision: Date,
    fechaVenc: Date,
    salidas: Salida[],
    codigo: string
  ) {
    this.nroPedido = nroPedido;
    this.detalles = detalles;
    this.servicioDelivery = servicioDelivery;
    this.cliente = cliente;
    this.igv = igv;
    this.total = total;
    this.estado = estado;
    this.fechaEmision = fechaEmision;
    this.fechaVenc = fechaVenc;
    this.salidas = salidas;
    this.codigo = codigo;
  }
}
