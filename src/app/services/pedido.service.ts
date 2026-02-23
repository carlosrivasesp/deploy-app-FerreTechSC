import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private url = 'http://localhost:4000/api/pedido';

  constructor(private http: HttpClient) {}

  // Obtener todas las Pedidos (puedes filtrar por tipoPedido con query param)
  getAllPedidos(): Observable<any> {
    let direccionUrl = this.url;
    return this.http.get<Pedido>(direccionUrl);
  }

  // Registrar Pedido
  registrarPedido(Pedido: Pedido): Observable<any> {
    let direccionUrl = this.url + '/pedido';
    return this.http.post<Pedido>(direccionUrl, Pedido);
  }

  // Obtener operación por ID
  obtenerPedido(id: string): Observable<any> {
    let direccionUrl = this.url +'/'+ id;
    return this.http.get<Pedido>(direccionUrl);
  }

  obtenerHistorialPorCliente(dni: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/pedido/${dni}`);
  }

  actualizarEstado(id: string, nuevoEstado: string): Observable<any> {
    let direccionUrl = this.url +'/'+ id + '/estado';
    return this.http.put<Pedido>(direccionUrl, { nuevoEstado });
  }

}
