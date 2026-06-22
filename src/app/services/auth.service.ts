import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../app/environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth`;

  registrar(data: any) {
    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );
  }

  login(data: any) {
    return this.http.post(
      `${this.apiUrl}/login`,
      data
    );
  }

  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  obtenerToken() {
    return localStorage.getItem('token');
  }

  cerrarSesion() {
    localStorage.removeItem('token');
  }

  estaLogueado() {
    return !!localStorage.getItem('token');
  }

  obtenerIdUsuario(): number | null {

  try {

    const token = this.obtenerToken();

    if (!token) {
      return null;
    }

    const payload: any = jwtDecode(token);

    console.log('PAYLOAD JWT:', payload);

    return payload.idUsuario;

  } catch (error) {

    console.error('Error decodificando JWT:', error);

    return null;

  }

}
}