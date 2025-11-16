import { Cliente } from "./cliente";  // Suponiendo que tienes el modelo Cliente
import { DetalleCotizacion } from "./detalleCotizacion";
// import { DetalleCotizacion } from "./detalleCotizacion";  // Comentado por ahora

export class Cotizacion {
  _id?: string;
  cliente: Cliente;
  contacto: string;
  telefono: string;
  fechaEmision: Date;
  fechaVenc: Date;
  moneda: string;
  tipoCambio: number;
  tiempoValidez: number;
  total: number;
  igv: number;
  estado: string;
  detalleC: DetalleCotizacion[];
  tipoComprobante?: string;  // Opcional
  metodoPago?: string;      // Opcional

  constructor(
    cliente: Cliente,
    contacto: string,
    telefono: string,
    fechaEmision: Date,
    fechaVenc: Date,
    moneda: string,
    tipoCambio: number,
    tiempoValidez: number,
    total: number,
    igv: number,
    estado: string,
    detalleC: DetalleCotizacion[] = [],
    tipoComprobante?: string,  // Opcional
    metodoPago?: string       // Opcional
  ) {
    this.cliente = cliente;
    this.contacto = contacto;
    this.telefono = telefono;
    this.fechaEmision = fechaEmision;
    this.fechaVenc = fechaVenc;
    this.moneda = moneda;
    this.tipoCambio = tipoCambio;
    this.tiempoValidez = tiempoValidez;
    this.igv = igv;
    this.total = total;
    this.estado = estado;
    this.detalleC = detalleC;
    this.tipoComprobante = tipoComprobante || 'Factura';  // Asigna valor por defecto si no se pasa
    this.metodoPago = metodoPago || 'Efectivo';           // Asigna valor por defecto si no se pasa
  }
}
