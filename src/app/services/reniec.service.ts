import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReniecService {
  url= 'http://localhost:4000/api/reniec/';

  constructor(private http: HttpClient) {}

  obtenerDatosPorDni(dni: string): Observable<any> {
    return this.http.get<any>(`${this.url}${dni}`);
  }
}