import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  cantidadCarrito = 0;

  constructor(
    private router: Router
  ) { }

  ngDoCheck(): void {

    const carrito = JSON.parse(
      localStorage.getItem('carrito') || '[]'
    );

    this.cantidadCarrito =
      carrito.reduce(
        (total: number, item: any) =>
          total + item.cantidad,
        0
      );

  }

  estaLogueado(): boolean {

    return !!localStorage.getItem('token');

  }

  cerrarSesion() {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  }
}
