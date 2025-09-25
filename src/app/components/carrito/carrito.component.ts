import { Component, OnInit } from '@angular/core';
import { CarritoService, CartItem, CarritoResponse } from '../../services/carrito.service'; // Ajusta la ruta

@Component({
    selector: 'app-carrito',
    standalone: false,
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
    cartItems: CartItem[] = [];
    moneda = 'S/';
    subtotal = 0;
    igv = 0;
    totalPrice = 0;

    constructor(private carritoService: CarritoService) {}

    ngOnInit(): void {
        this.loadCart();
    }

loadCart(): void {
    this.carritoService.getCart().subscribe({
        next: (res: CarritoResponse) => {
            this.cartItems = res.items;
            this.moneda = res.moneda;
            this.subtotal = res.subtotal;
            this.igv = res.igv;
            this.totalPrice = res.total;
        },
        error: (err) => {
            console.error('Error cargando carrito:', err);
        }
    });
}
  cambiarCantidad(item: any, cambio: number) {
    const nuevaCantidad = item.cantidad + cambio;
    if (nuevaCantidad < 1) return;
    item.cantidad = nuevaCantidad;
    this.updateQuantity(item);
  }

    removeItem(item: CartItem): void {
        this.carritoService.removeItem(item.producto._id).subscribe({
            next: () => {
                this.loadCart(); // recarga el carrito actualizado
            },
            error: (err) => {
                console.error('Error eliminando item:', err);
            }
        });
    }

    updateQuantity(item: CartItem): void {
        if (item.cantidad < 1) {
            item.cantidad = 1; // evitar cantidades menores a 1
        }
        this.carritoService.setQty(item.producto._id, item.cantidad).subscribe({
            next: () => this.loadCart(),
            error: (err) => console.error('Error actualizando cantidad:', err)
        });
    }

    checkout(): void {
        // Aquí puedes implementar el checkout luego
        console.log('Checkout pendiente...');
    }
}
