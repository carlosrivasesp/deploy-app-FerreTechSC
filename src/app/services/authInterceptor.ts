// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Suponiendo que guardas el token en localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Clonar la petición para añadir el header Authorization
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      // Si no hay token, continuar sin modificar la petición
      return next.handle(req);
    }
  }
}
