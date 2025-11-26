import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  // Cambia esta URL por la de tu backend real
  private apiUrl = 'https://deploy-server-ferretechsc.onrender.com/api/getPedidoCliente';

  constructor(private http: HttpClient) { }

  // Obtener historial de compras
  obtenerHistorial(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerHistorialPorCliente(dni: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${dni}`);
}

}
