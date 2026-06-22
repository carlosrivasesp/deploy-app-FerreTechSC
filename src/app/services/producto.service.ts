import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/productos`;

  obtenerProductos() {
    return this.http.get(this.apiUrl);
  }

  obtenerProductoPorId(id: number) {
    return this.http.get(
      `${this.apiUrl}/${id}`
    );
  }
}