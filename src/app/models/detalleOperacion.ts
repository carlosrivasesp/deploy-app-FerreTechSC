import { Producto } from "./producto";  
import { Operacion } from "./operacion";

export class DetalleOperacion {
  _id?: string;
  operacionId: Operacion;   // Referencia a la operación
  producto: Producto;     // Referencia al producto
  codInt: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
  cantidadPendiente?: number;

  constructor(
    operacionId: Operacion,
    producto: Producto,
    codInt: string,
    nombre: string,
    cantidad: number,
    precio: number,
    subtotal: number,
    cantidadPendiente?: number
  ) {
    this.operacionId = operacionId;
    this.producto = producto;
    this.codInt = codInt;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
    this.subtotal = subtotal;
    this.cantidadPendiente = cantidadPendiente;
  }
}
