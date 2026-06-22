import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  registrar() {

    if (this.form.invalid) return;

    this.authService
      .registrar(this.form.value)
      .subscribe({
        next: (resp) => {
          console.log(resp);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
