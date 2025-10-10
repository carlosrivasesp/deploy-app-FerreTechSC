import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operacion } from '../models/operacion';

@Injectable({
  providedIn: 'root'
})
export class OperacionService {

  private url = 'http://localhost:4000/api/operacion/';

  constructor(private http: HttpClient) {}

  // Obtener todas las operaciones (puedes filtrar por tipoOperacion con query param)
  getAllOperaciones(tipoOperacion?: number): Observable<any> {
    let direccionUrl = this.url;
    if (tipoOperacion) {
      direccionUrl += `?tipoOperacion=${tipoOperacion}`;
    }
    return this.http.get<Operacion[]>(direccionUrl);
  }

  // Registrar Pedido
  registrarPedido(operacion: Operacion): Observable<any> {
    let direccionUrl = this.url + 'pedido';
    return this.http.post<Operacion>(direccionUrl, operacion);
  }

  // Registrar Cotización
  registrarCotizacion(operacion: Operacion): Observable<any> {
    let direccionUrl = this.url + 'cotizacion';
    return this.http.post<Operacion>(direccionUrl, operacion);
  }

  // Obtener operación por ID
  obtenerOperacion(id: string): Observable<any> {
    let direccionUrl = this.url + id;
    return this.http.get<Operacion>(direccionUrl);
  }

  obtenerHistorialPorCliente(dni: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/pedido/${dni}`);
  }
/*
  // Actualizar estado de la operación
  actualizarEstado(id: string, nuevoEstado: string, datosVenta?: any): Observable<any> {
    let direccionUrl = this.url + id + '/estado';
    return this.http.put<Operacion>(direccionUrl, { nuevoEstado, datosVenta });
  }
  */
}
