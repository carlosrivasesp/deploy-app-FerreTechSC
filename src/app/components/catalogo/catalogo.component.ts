import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  standalone: false
})
export class CatalogoComponent implements OnInit {
  
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);

  productos: any[] = [];

  ngOnInit(): void {
    console.log('CATALOGO INICIADO');
    this.cargarProductos();
  }

  cargarProductos() {

    this.productoService
      .obtenerProductos()
      .subscribe({

        next: (resp: any) => {

  console.log('PRODUCTOS:', resp);

  this.productos = resp;

  setTimeout(() => {

    console.log(
      'LENGTH COMPONENTE:',
      this.productos.length
    );

  }, 1000);

},

        error: (error) => {

          console.error('ERROR:', error);

        }

      });

  }
  agregarAlCarrito(producto: any) {

    if (producto.StockActual <= 0) {

      alert('Producto sin stock disponible');

      return;

    }

    this.carritoService
        .agregarProducto(producto);

    alert('Producto agregado');

  }
}
