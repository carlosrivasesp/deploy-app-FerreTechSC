import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-principal',
  standalone: false,
  templateUrl: './navbar-principal.component.html',
  styleUrls: ['./navbar-principal.component.css']
})
export class NavbarPrincipalComponent {
  cartItems: any[] = [
    { nombre: 'Producto 1', precio: 20.00, cantidad: 1 },
    { nombre: 'Producto 2', precio: 15.00, cantidad: 2 }
  ];

  showCarrito: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  get user(): any {
    return this.authService.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('dniCliente');
    this.router.navigate(['/']);
  }

  toggleCarrito(): void {
    this.showCarrito = !this.showCarrito;
  }
}
