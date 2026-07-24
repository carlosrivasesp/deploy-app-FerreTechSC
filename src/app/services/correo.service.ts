import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/correo/evidencia`;

  enviarEvidencia(
    nroPedido: string,
    archivo: File
  ) {

    const formData = new FormData();

    formData.append(
      'nroPedido',
      nroPedido
    );

    formData.append(
      'archivo',
      archivo
    );

    return this.http.post(
      this.apiUrl,
      formData
    );

  }

}