import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/pedidos`;

  crearPedido(data: any) {

    return this.http.post(
      this.apiUrl,
      data
    );

  }

  obtenerPedidosUsuario(idUsuario: number) {

    return this.http.get(
        `${this.apiUrl}/usuario/${idUsuario}`
    );

  }

  obtenerPedidoPorId(idPedido: number) {

    return this.http.get(
      `${this.apiUrl}/${idPedido}`
    );

  }

  obtenerClientePorDocumento(documento: string) {

    return this.http.get(
      `${this.apiUrl}/cliente/${documento}`
    );

  }

}