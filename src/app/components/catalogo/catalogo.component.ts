import { Component } from '@angular/core';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  standalone: false
})
export class CatalogoComponent {
  searchTerm: string = '';

  productos = [
    {
      nombre: 'Taladro Bosch',
      descripcion: 'Taladro percutor de 500W.',
      precio: 249.90,
      imagen: 'cemento.jpg'
    },
    {
      nombre: 'Destornillador eléctrico',
      descripcion: 'Ideal para trabajos domésticos.',
      precio: 89.50,
      imagen: 'cemento.jpg'
    },
    {
      nombre: 'Juego de llaves',
      descripcion: 'Set de 12 piezas de acero templado.',
      precio: 59.99,
      imagen: 'cemento.jpg'
    },
    // Puedes agregar más productos aquí
  ];

  get productosFiltrados() {
    if (!this.searchTerm) {
      return this.productos;
    }

    const term = this.searchTerm.toLowerCase();
    return this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(term) ||
      producto.descripcion.toLowerCase().includes(term)
    );
  }
}
