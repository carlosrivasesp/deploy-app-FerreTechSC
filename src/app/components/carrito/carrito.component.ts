import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/carrito'; // Importar la interfaz

@Component({
    selector: 'app-carrito',
    standalone: false,
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
    cartItems: CartItem[] = [
        { nombre: 'Producto 1', precio: 20.00, cantidad: 1 },
        { nombre: 'Producto 2', precio: 15.00, cantidad: 1 }
    ];

    totalPrice = 0;

    ngOnInit(): void {
        this.updateTotal();
    }

    updateTotal(): void {
        this.totalPrice = this.cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    removeItem(item: CartItem): void { // Definir el tipo del parámetro 'item'
        const index = this.cartItems.indexOf(item);
        if (index > -1) {
            this.cartItems.splice(index, 1);
            this.updateTotal();
        }
    }
}
