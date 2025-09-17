export class DetallePedido {
  _id?: string;        // ID único del detalle
  pedido?: string;     // ID del pedido al que pertenece
  producto: string;    // ID del producto
  codInt?: string;     // Código interno
  nombre: string;      // Nombre del producto
  cantidad: number;    // Cantidad pedida
  precio: number;      // Precio unitario
  subtotal: number;    // Total por ítem (cantidad * precio)
  __v?: number;        // Versión de Mongoose (si lo necesitas)

  constructor(
    producto: string,
    nombre: string,
    cantidad: number,
    precio: number,
    subtotal: number,
    codInt?: string,
    _id?: string,
    pedido?: string,
    __v?: number
  ) {
    this.producto = producto;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
    this.subtotal = subtotal;
    this.codInt = codInt;
    this._id = _id;
    this.pedido = pedido;
    this.__v = __v;
  }
}
