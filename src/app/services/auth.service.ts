import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://deploy-server-ferretechsc.onrender.com/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, usuario);
  }

  iniciarSesion(correo: string, password: string): Observable<any> {
    const correoNormalizado = correo.toLowerCase().trim();

    return this.http.post(`${this.baseUrl}/login`, { 
      correo: correoNormalizado, 
      password 
    }).pipe(
      tap((res: any) => {
        this.guardarDatosSesion(res);
        this.redirigirSegunRol(res.usuario.rol);
      })
    );
  }

  private redirigirSegunRol(rol: string): void {
    if (rol === 'admin') {
      this.router.navigate(['/dashboard']);
    } else if (rol === 'cliente') {
      this.router.navigate(['/principal']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  private guardarDatosSesion(res: any): void {
    // ✅ Siempre usar sessionStorage para todos
    sessionStorage.setItem('token', res.token);
    sessionStorage.setItem('user', JSON.stringify(res.usuario));
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'admin';
  }

  logout(): void {
    sessionStorage.clear(); // ✅ borrar todo
    this.router.navigate(['/principal']);
  }

  getCurrentUser(): any | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
