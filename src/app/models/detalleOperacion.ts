import { Operacion } from "./operacion";
import { Producto } from "./producto";

export class DetalleOperacion {
  _id?: string;
  operacionId: Operacion;
  producto: Producto;
  codInt: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;

  constructor(
    operacionId: Operacion,
    producto: Producto,
    codInt: string,
    nombre: string,
    cantidad: number,
    precio: number,
    subtotal: number
  ) {
    this.operacionId = operacionId;
    this.producto = producto;
    this.codInt = codInt;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
    this.subtotal = subtotal;
  }
}
