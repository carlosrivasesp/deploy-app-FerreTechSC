import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  // Cambia esta URL por la de tu backend real
  private apiUrl = 'http://localhost:4000/api/getPedidoCliente/75330125';

  constructor(private http: HttpClient) { }

  // Obtener historial de compras
  obtenerHistorial(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Si en el futuro quieres buscar por cliente
  obtenerHistorialPorCliente(idCliente: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${idCliente}`);
  }
}
