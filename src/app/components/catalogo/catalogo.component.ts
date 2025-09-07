import { Component } from '@angular/core';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  standalone: false
})
export class CatalogoComponent {
  searchTerm: string = '';
  selectedCategory: string = '';
  sortOrder: string = 'az'; // 'az' = A-Z, 'za' = Z-A

  // Rango de precios
  minPrice: number = 0;
  maxPrice: number = 100;
  selectedMinPrice: number = 0;
  selectedMaxPrice: number = 100;

  productos: any[] = [
    { nombre: 'Pegamento 1', descripcion: 'Descripción del producto', precio: 10, categoria: 'Pegamentos', imagen: 'cemento.jpg' },
    { nombre: 'Pegamento 2', descripcion: 'Descripción del producto', precio: 12, categoria: 'Pegamentos', imagen: 'cemento.jpg' },
    { nombre: 'Pegamento 3', descripcion: 'Descripción del producto', precio: 15, categoria: 'Pegamentos', imagen: 'cemento.jpg' },
    { nombre: 'Pegamento 4', descripcion: 'Descripción del producto', precio: 8, categoria: 'Pegamentos', imagen: 'cemento.jpg' },
    { nombre: 'Pegamento 5', descripcion: 'Descripción del producto', precio: 18, categoria: 'Pegamentos', imagen: 'cemento.jpg' },
    { nombre: 'Herramienta 1', descripcion: 'Descripción del producto', precio: 25, categoria: 'Herramientas', imagen: 'cemento.jpg' },
    { nombre: 'Herramienta 2', descripcion: 'Descripción del producto', precio: 30, categoria: 'Herramientas', imagen: 'cemento.jpg' },
    { nombre: 'Herramienta 3', descripcion: 'Descripción del producto', precio: 28, categoria: 'Herramientas', imagen: 'cemento.jpg' },
    { nombre: 'Herramienta 4', descripcion: 'Descripción del producto', precio: 35, categoria: 'Herramientas', imagen: 'cemento.jpg' },
    { nombre: 'Herramienta 5', descripcion: 'Descripción del producto', precio: 40, categoria: 'Herramientas', imagen: 'cemento.jpg' },
    { nombre: 'Accesorio 1', descripcion: 'Descripción del producto', precio: 5, categoria: 'Accesorios', imagen: 'cemento.jpg' },
    { nombre: 'Accesorio 2', descripcion: 'Descripción del producto', precio: 7, categoria: 'Accesorios', imagen: 'cemento.jpg' },
    { nombre: 'Accesorio 3', descripcion: 'Descripción del producto', precio: 6, categoria: 'Accesorios', imagen: 'cemento.jpg' },
    { nombre: 'Accesorio 4', descripcion: 'Descripción del producto', precio: 9, categoria: 'Accesorios', imagen: 'cemento.jpg' },
    { nombre: 'Accesorio 5', descripcion: 'Descripción del producto', precio: 11, categoria: 'Accesorios', imagen: 'cemento.jpg' },
    { nombre: 'Producto Extra 1', descripcion: 'Descripción de producto extra', precio: 20, categoria: 'Pegamentos', imagen: 'cemento.jpg' },
    { nombre: 'Producto Extra 2', descripcion: 'Descripción de producto extra', precio: 22, categoria: 'Herramientas', imagen: 'cemento.jpg' },
    { nombre: 'Producto Extra 3', descripcion: 'Descripción de producto extra', precio: 24, categoria: 'Accesorios', imagen: 'cemento.jpg' },
    { nombre: 'Producto Extra 4', descripcion: 'Descripción de producto extra', precio: 26, categoria: 'Herramientas', imagen: 'cemento.jpg' },
    { nombre: 'Producto Extra 5', descripcion: 'Descripción de producto extra', precio: 29, categoria: 'Pegamentos', imagen: 'cemento.jpg' },
  ];

  // Categorías únicas para el dropdown
  get categorias(): string[] {
    return [...new Set(this.productos.map(p => p.categoria))];
  }

  // Lógica de búsqueda, filtro, rango y ordenamiento
  get productosFiltrados() {
    let filtrados = [...this.productos];

    // Filtro por texto
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion.toLowerCase().includes(term)
      );
    }

    // Filtro por categoría
    if (this.selectedCategory) {
      filtrados = filtrados.filter(p => p.categoria === this.selectedCategory);
    }

    // Filtro por rango de precios
    filtrados = filtrados.filter(p =>
      p.precio >= this.selectedMinPrice && p.precio <= this.selectedMaxPrice
    );

    // Orden alfabético
    filtrados = filtrados.sort((a, b) => {
      const nameA = a.nombre.toLowerCase();
      const nameB = b.nombre.toLowerCase();
      return this.sortOrder === 'az'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    return filtrados;
  }
}
