import { Producto } from "./producto";  
import { Pedido } from "./pedido";

export class DetallePedido {
  _id?: string;
  PedidoId: Pedido;   // Referencia a la operación
  producto: Producto;     // Referencia al producto
  codInt: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
  cantidadPendiente?: number;

  constructor(
    PedidoId: Pedido,
    producto: Producto,
    codInt: string,
    nombre: string,
    cantidad: number,
    precio: number,
    subtotal: number,
    cantidadPendiente?: number
  ) {
    this.PedidoId = PedidoId;
    this.producto = producto;
    this.codInt = codInt;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
    this.subtotal = subtotal;
    this.cantidadPendiente = cantidadPendiente;
  }
}
