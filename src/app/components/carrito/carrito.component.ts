import { Component } from '@angular/core';
import { CarritoService} from '../../services/carrito.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-carrito',
    standalone: false,
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
    
  carrito: any[] = [];

  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) {

    this.cargarCarrito();

  }

  cargarCarrito() {

    this.carrito =
      this.carritoService.obtenerCarrito();

  }

  eliminar(idPresentacionVenta: number) {

    this.carritoService
      .eliminarProducto(idPresentacionVenta);

    this.cargarCarrito();

  }

  get total() {

    return this.carrito.reduce(
      (acum, item) =>
        acum + (item.PrecioVenta * item.cantidad),
      0
    );

  }

  irCheckout() {

    if (this.carrito.length === 0) {

      alert(
        'Debe agregar productos al carrito'
      );

      return;

    }

    this.router.navigate([
      '/checkout'
    ]);

  }
}
