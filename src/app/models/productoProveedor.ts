import { Categoria } from "./categoria";
import { Marca } from "./marca";

export class ProductoProveedor {
  _id?: string;
  codInt: string;
  nombre: string;
  precio: number;
  categoria: Categoria;
  marca: Marca;
  constructor(
    codInt: string,
    nombre: string,
    precio: number,
    categoria: Categoria,
    marca: Marca,
  ) {
    this.codInt = codInt;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.marca = marca;
    }
}
