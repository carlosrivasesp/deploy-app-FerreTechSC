import { Component, OnInit } from '@angular/core';
import { CarritoService, CartItem } from '../../services/carrito.service'; // Ajusta la ruta
import { Router } from '@angular/router';

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

  constructor(private carritoService: CarritoService, private router: Router) { }

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
    if (!this.cliente || this.cliente.trim() === '') {
      alert('Debe seleccionar o ingresar un cliente antes de confirmar la compra.');
      return;
    }

    // Mapear correctamente los nombres esperados por el backend
    const data = {
      tipoComprobante:
        this.tipoComprobante === 'Factura'
          ? 'FACTURA DE VENTA ELECTRONICA'
          : 'BOLETA DE VENTA ELECTRONICA',
      metodoPago: this.metodoPago,
      cliente: this.cliente,
      servicioDelivery: this.servicioDelivery
    };

    this.carritoService.checkout(data).subscribe({
      next: (response) => {
        console.log('✅ Pedido, venta y entrega creados correctamente:', response);

        alert('Compra registrada correctamente.');
        this.router.navigate(['/historial-compras-cli']);
      },
      error: (err) => {
        console.error('❌ Error confirmando la compra:', err);
        alert(err.error?.mensaje || 'Error al registrar la compra. Intente nuevamente.');
      }
    });
  }

}
