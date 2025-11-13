import { Categoria } from "./categoria";
import { Marca } from "./marca";
import { ProductoProveedor } from "./productoProveedor";

export class Producto {
  _id?: string;
  codInt: string;
  nombre: string;
  precio: number;
  stockActual: number;
  stockMin: number;
  categoria: Categoria;
  marca: Marca;
  estado: string;
  imageUrl?: string;
  productoProveedor?: ProductoProveedor;

  constructor(
    codInt: string,
    nombre: string,
    precio: number,
    stockActual: number,
    stockMin: number,
    categoria: Categoria,
    marca: Marca,
    estado: string,
    productoProveedor?: ProductoProveedor,
    imageUrl?: string,
  ) {
    this.codInt = codInt;
    this.nombre = nombre;
    this.precio = precio;
    this.stockActual = stockActual;
    this.stockMin = stockMin;
    this.categoria = categoria;
    this.marca = marca;
    this.estado = estado;
    this.imageUrl = imageUrl;
    this.productoProveedor = productoProveedor;
  }
}
