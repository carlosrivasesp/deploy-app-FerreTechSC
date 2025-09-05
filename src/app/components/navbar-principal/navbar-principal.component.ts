import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-principal',
  standalone: false,
  templateUrl: './navbar-principal.component.html',
  styleUrls: ['./navbar-principal.component.css']
})
export class NavbarPrincipalComponent {
  // Aquí guardaremos los productos en el carrito
  cartItems: any[] = [
    { nombre: 'Producto 1', precio: 20.00, cantidad: 1 },
    { nombre: 'Producto 2', precio: 15.00, cantidad: 2 }
  ];

  // Variable para mostrar/ocultar el carrito
  showCarrito: boolean = false;

  // Función para alternar la visibilidad del carrito
  toggleCarrito(): void {
    this.showCarrito = !this.showCarrito;
  }
}
