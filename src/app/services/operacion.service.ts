import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operacion } from '../models/operacion';

@Injectable({
  providedIn: 'root'
})
export class OperacionService {
  private apiUrl = 'http://localhost:4000/api/operacion';

  constructor(private http: HttpClient) {}

  getOperaciones(tipoOperacion?: number): Observable<any> {
    return this.http.get<Operacion[]>(this.apiUrl + "?tipoOperacion="+`${tipoOperacion}`);
  }

  getOperacionById(id: string): Observable<any> {
    return this.http.get<Operacion>(`${this.apiUrl}/${id}`);
  }

  registrarVenta(venta: Operacion): Observable<any> {
    return this.http.post<Operacion>(`${this.apiUrl}/venta`, venta);
  }

  registrarCompra(compra: Operacion): Observable<any> {
    return this.http.post<Operacion>(`${this.apiUrl}/compra`, compra);
  }

  registrarCotizacion(cotizacion: Operacion): Observable<any> {
    return this.http.post<Operacion>(`${this.apiUrl}/cotizacion`, cotizacion);
  }

  actualizarEstado(id: string, body: { nuevoEstado: string; datosVenta?: any }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, body);
  }
}
