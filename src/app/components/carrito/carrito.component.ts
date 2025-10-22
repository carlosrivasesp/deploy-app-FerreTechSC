import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, CartItem, CarritoResponse } from '../../services/carrito.service';

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
    clienteForm!: FormGroup;

    constructor(
        private carritoService: CarritoService,
        private fb: FormBuilder,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadCart();
        this.initForm();
    }

    initForm(): void {
        this.clienteForm = this.fb.group({
            nombre: ['', Validators.required],
            tipoDocumento: ['', Validators.required],
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
            correo: ['', [Validators.required, Validators.email]],
            delivery: [false],
            direccion: [''],
            distrito: ['']
        });

        // Limpia campos de delivery si no está marcado
        this.clienteForm.get('delivery')?.valueChanges.subscribe((checked) => {
            if (!checked) {
                this.clienteForm.patchValue({ direccion: '', distrito: '' });
            }
        });
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
            error: (err) => console.error('Error cargando carrito:', err)
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
            next: () => this.loadCart(),
            error: (err) => console.error('Error eliminando item:', err)
        });
    }

    updateQuantity(item: CartItem): void {
        if (item.cantidad < 1) item.cantidad = 1;
        this.carritoService.setQty(item.producto._id, item.cantidad).subscribe({
            next: () => this.loadCart(),
            error: (err) => console.error('Error actualizando cantidad:', err)
        });
    }

    checkout(): void {
        this.router.navigate(['/resumen-compra']);
    }

    onSubmit(): void {
        if (this.clienteForm.invalid) {
            this.clienteForm.markAllAsTouched();
            return;
        }
        console.log('Datos del cliente:', this.clienteForm.value);
        alert('Pedido confirmado ✅');
    }
}
