import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  correo = '';
  password = '';

  cargando = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  iniciarSesion() {

    this.error = '';
    this.cargando = true;

    this.authService
      .login({
        correo: this.correo,
        password: this.password
      })
      .subscribe({

        next: (resp: any) => {

          this.authService
            .guardarToken(resp.token);

          this.router.navigate(['/']);

        },

        error: (error) => {

          console.error(error);

          this.error =
            'Correo o contraseña incorrectos';

          this.cargando = false;

        }

      });

  }

}