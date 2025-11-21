import { Proveedor } from "./proveedor";
import { DetalleCompra } from "./detalleC";
import { Ingreso } from "./ingreso";

export class OrdenCompra {
  _id?: string;
  codigo: string; // Aquí se define 'codigo'
  fechaCreacion: Date;
  total: number;
  estado: string;
  proveedor: Proveedor;
  detalles: DetalleCompra[];
  ingresos?: Ingreso[];

  constructor(
    codigo: string,
    fechaCreacion: Date,
    total: number,
    estado: string,
    proveedor: Proveedor,
    detalles: DetalleCompra[] = [],
    ingresos: Ingreso[]
  ) {
    this.codigo = codigo; // Asegúrate de que la propiedad 'codigo' esté correctamente asignada.
    this.fechaCreacion = fechaCreacion;
    this.total = total;
    this.estado = estado;
    this.proveedor = proveedor;
    this.detalles = detalles;
    this.ingresos = ingresos;
  }
}
