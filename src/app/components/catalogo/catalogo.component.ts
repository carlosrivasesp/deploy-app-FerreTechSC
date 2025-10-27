import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito.service';
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  standalone: false
})
export class CatalogoComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = '';
  sortOrder: string = 'az'; // 'az' = A-Z, 'za' = Z-A

  // Precios fijos
  minPrice: number = 0;
  maxPrice: number = 100;
  selectedMinPrice: number = 0;
  selectedMaxPrice: number = 100;
  selectedMarcas: { [marca: string]: boolean } = {};

  productos: Producto[] = [];

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 30;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService // inyecta servicio carrito
  ) {}

  ngOnInit(): void {
    this.productoService.getAllProductos().subscribe((data: Producto[]) => {
      this.productos = data;
      
    });
  }

  // Categorías únicas para el dropdown
  get categorias(): string[] {
    return [...new Set(this.productos.map(p => p.categoria.nombre))];
  }

  // Marcas únicas para filtros
  get marcas(): string[] {
    return [...new Set(this.productos.map(p => p.marca?.nombre).filter(Boolean))];
  }

  // Productos filtrados sin paginar
  get productosFiltradosSinPaginar(): Producto[] {
    let filtrados = [...this.productos];

    // Solo productos con estado "Activo"
    filtrados = filtrados.filter(p => p.estado === 'Activo');

    // Filtro por texto
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        (p.categoria && p.categoria.nombre.toLowerCase().includes(term)) ||
        (p.marca && p.marca.nombre.toLowerCase().includes(term))
      );
    }

    // Filtro por marcas seleccionadas
    if (Object.values(this.selectedMarcas).some(selected => selected)) {
      filtrados = filtrados.filter(p => this.selectedMarcas[p.marca?.nombre || ''] === true);
    }

    // Filtro por categoría
    if (this.selectedCategory) {
      filtrados = filtrados.filter(p => p.categoria.nombre === this.selectedCategory);
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

  // Productos filtrados para mostrar solo la página actual
  get productosFiltrados(): Producto[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.productosFiltradosSinPaginar.slice(start, end);
  }

  // Total de páginas para paginación
  get totalPages(): number {
    return Math.ceil(this.productosFiltradosSinPaginar.length / this.itemsPerPage);
  }

  // Cambiar página
  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
agregarAlCarrito(producto: Producto) {
  if (!producto._id) {
    alert('El producto no tiene ID y no se puede agregar al carrito.');
    return;
  }

  this.carritoService.addItem(producto, 1).subscribe({
    next: () => {
      alert(`Se agregó ${producto.nombre} al carrito`);
    },
    error: (err) => {
      console.error('Error agregando producto al carrito:', err);
      alert('Error al agregar producto al carrito');
    }
  });
}

}
