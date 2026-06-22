export interface Producto {
  idProducto: number;
  codigo: string;
  producto: string;
  categoria: string;
  marca: string;
  stockActual: number;
  idPresentacionVenta: number;
  precioVenta: number;
  unidadMedida: string;
}