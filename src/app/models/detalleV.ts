import { Producto } from "./producto";  // Asegúrate de tener un modelo de Producto
import { Venta } from "./venta";

export class DetalleVenta {
  _id?: string;
  ventaId: Venta;
  producto: Producto;
  codInt: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;

  constructor(
    ventaId: Venta,
    producto: Producto,
    codInt: string,
    nombre: string,
    cantidad: number,
    precio: number,
    subtotal: number
  ) {
    this.ventaId = ventaId;
    this.producto = producto;
    this.codInt = codInt;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
    this.subtotal = subtotal;
  }
}
