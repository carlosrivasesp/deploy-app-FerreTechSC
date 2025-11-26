import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingreso } from '../models/ingreso';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private url = 'https://deploy-server-ferretechsc.onrender.com/api/ingresos';

  constructor(private http: HttpClient) { }

  getAllIngresos(): Observable<any> {
    let direccionUrl = this.url;
    return this.http.get<Ingreso>(direccionUrl);
  }

  obtenerIngreso(id: string): Observable<any> {
    let direccionUrl = this.url;
    return this.http.get<Ingreso>(direccionUrl + '/' + id);
  }

  registrarIngreso(ingreso: Ingreso): Observable<any> {
    return this.http.post(`${this.url}`, ingreso);
  }
}
