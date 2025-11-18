import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdenCompra } from '../models/ordenCompra';

@Injectable({
  providedIn: 'root',
})
export class OrdenCompraService {
  private url = 'http://localhost:4000/api/ordenC';

  constructor(private http: HttpClient) {}

  registrarCompra(compra: OrdenCompra): Observable<any> {
    let direccionUrl = this.url;
    return this.http.post<OrdenCompra>(direccionUrl, compra);
  }

  getAllCompras(): Observable<any> {
    let direccionUrl = this.url;
    return this.http.get<OrdenCompra>(direccionUrl);
  }

  obtenerCompra(id: string): Observable<any> {
    let direccionUrl = this.url;
    return this.http.get<OrdenCompra>(direccionUrl + '/' + id);
  }

  actualizarEstado(id: string, estado: string): Observable<any> {
    return this.http.put(`${this.url}/estado/${id}`, { estado });
  }
}
