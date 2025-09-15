import { Cliente } from "./cliente";
import { DetallePedido } from "./detallePedido";

export class HistorialPedido {
  _id?: string;                  // ID del pedido
  Cliente: Cliente;              // Cliente asociado
  detalles: DetallePedido[];     // Lista de productos del pedido
  estado: string;                // Ej: "Pagado"
  total: number;                 // Monto total
  igv: number;                   // IGV aplicado
  fechaEmision: Date;            // Fecha de emisión
  __v?: number;                  // Versión (Mongoose)

  constructor(
    Cliente: Cliente,
    detalles: DetallePedido[] = [],
    estado: string,
    total: number,
    igv: number,
    fechaEmision: Date,
    _id?: string,
    __v?: number
  ) {
    this.Cliente = Cliente;
    this.detalles = detalles;
    this.estado = estado;
    this.total = total;
    this.igv = igv;
    this.fechaEmision = fechaEmision;
    this._id = _id;
    this.__v = __v;
  }
}
