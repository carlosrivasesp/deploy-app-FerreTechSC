import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartItem } from '../../models/carrito'; // Importar la interfaz
import { SidebarService } from '../../services/sidebar.service';

@Component({
    selector: 'app-carrito',
    standalone: false,
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, OnDestroy {
    cartItems: CartItem[] = [
        { nombre: 'Producto 1', precio: 20.00, cantidad: 1 },
        { nombre: 'Producto 2', precio: 15.00, cantidad: 1 }
    ];

    totalPrice = 0;

    // Inyectar el servicio SidebarService para manejar la visibilidad del sidebar
    constructor(private sidebarService: SidebarService) { }

    ngOnInit(): void {
        // Ocultar el sidebar cuando el componente Carrito se cargue
        this.sidebarService.hideSidebar();
        this.updateTotal();
    }

    ngOnDestroy(): void {
        // Mostrar el sidebar cuando el componente Carrito se destruya
        this.sidebarService.showSidebar();
    }

    // Método para actualizar el precio total
    updateTotal(): void {
        this.totalPrice = this.cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    // Método para eliminar un item del carrito
    removeItem(item: CartItem): void { // Definir el tipo del parámetro 'item'
        const index = this.cartItems.indexOf(item);
        if (index > -1) {
            this.cartItems.splice(index, 1);
            this.updateTotal();
        }
    }
}
