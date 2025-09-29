import { Component, OnInit } from '@angular/core';
import { CarritoService, CartItem } from '../../services/carrito.service'; // Ajusta la ruta

@Component({
  selector: 'app-resumen-compra',
  standalone: false,
  templateUrl: './resumen-compra.component.html',
  styleUrls: ['./resumen-compra.component.css']
})
export class ResumenCompraComponent implements OnInit {
  cartItems: CartItem[] = [];
  moneda = 'S/';
  subtotal = 0;
  igv = 0;
  totalPrice = 0;

  // Datos para la confirmación de compra
  tipoComprobante = 'Factura';
  metodoPago = 'Efectivo';
  cliente = '';
  servicioDelivery = false;

  constructor(private carritoService: CarritoService) { }

  ngOnInit(): void {
    // Cargar datos del carrito
    this.loadCart();
  }

  loadCart(): void {
    this.carritoService.getCart().subscribe({
      next: (res) => {
        this.cartItems = res.items;
        this.moneda = res.moneda;
        this.subtotal = res.subtotal;
        this.igv = res.igv;
        this.totalPrice = res.total;
      },
      error: (err) => {
        console.error('Error cargando carrito en el resumen:', err);
      }
    });
  }

  confirmarCompra(): void {
    const data = {
      tipoComprobante: this.tipoComprobante,
      metodoPago: this.metodoPago,
      cliente: this.cliente,
      servicioDelivery: this.servicioDelivery
    };

    // Llamar al servicio de carrito para procesar el checkout
    this.carritoService.checkout(data).subscribe({
      next: (response) => {
        console.log('Compra confirmada', response);
        // Redirigir a la página de confirmación o a otra vista
      },
      error: (err) => {
        console.error('Error confirmando la compra:', err);
      }
    });
  }
}
