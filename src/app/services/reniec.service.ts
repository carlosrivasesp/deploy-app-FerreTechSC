import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReniecService {
  url= 'https://deploy-server-ferretechsc.onrender.com/api/reniec/';

  constructor(private http: HttpClient) {}

  obtenerDatosPorDni(dni: string): Observable<any> {
    return this.http.get<any>(`${this.url}${dni}`);
  }
}