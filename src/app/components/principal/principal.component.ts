import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-principal',
  standalone: false,
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {

  productos = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  productosExpandido = [...this.productos, ...this.productos];

  offsetPercent = 0;
  slidesPerView = 6;
  slideWidth = '16.66%';

  productosMasVendidos: any[] = [];
galeria: string[] = [
  'images1.jpg',
  'images2.jpg',
  'images3.jpg',
  'images4.jpg',
  'images5.jpg',
  'images6.jpg',
  'images7.jpg',
  'images8.jpg',
];

imagenSeleccionada: string | null = null;

abrirModal(img: string) {
  this.imagenSeleccionada = img;
}

cerrarModal() {
  this.imagenSeleccionada = null;
}

  constructor(private ventaService: VentaService) {}

  ngOnInit() {
    this.updateSlideWidth();
    window.addEventListener('resize', () => this.updateSlideWidth());

    this.cargarProductosMasVendidos();
  }

cargarProductosMasVendidos() {
  this.ventaService.getAllVentas().subscribe({
    next: (ventas) => {
      const productosMap = new Map<string, any>();

      for (const venta of ventas) {
        if (venta.estado !== 'Registrado') continue;

        for (const detalle of venta.detalles || []) {
          if (!productosMap.has(detalle.nombre)) {
            productosMap.set(detalle.nombre, {
              nombre: detalle.nombre,
              cantidadVendida: detalle.cantidad,
              precio: detalle.precio,
            });
          } else {
            const prod = productosMap.get(detalle.nombre);
            prod.cantidadVendida += detalle.cantidad;
            productosMap.set(detalle.nombre, prod);
          }
        }
      }

      // Ordenar y limitar a 8 productos
      this.productosMasVendidos = Array.from(productosMap.values())
        .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
        .slice(0, 8);
    },
    error: (err) => {
      console.error('Error al cargar productos más vendidos:', err);
    }
  });
}


  updateSlideWidth() {
    const width = window.innerWidth;

    if (width < 576) {
      this.slidesPerView = 1;
    } else if (width < 768) {
      this.slidesPerView = 2;
    } else if (width < 992) {
      this.slidesPerView = 3;
    } else if (width < 1200) {
      this.slidesPerView = 4;
    } else if (width < 1400) {
      this.slidesPerView = 5;
    } else {
      this.slidesPerView = 6;
    }

    this.slideWidth = (100 / this.slidesPerView).toFixed(4) + '%';
  }

  prev() {
    this.offsetPercent += 100 / this.slidesPerView;
    if (this.offsetPercent > 0) {
      this.offsetPercent = -((this.productosExpandido.length / this.slidesPerView) - 1) * (100 / this.slidesPerView);
    }
  }

  next() {
    this.offsetPercent -= 100 / this.slidesPerView;
    const maxOffset = -((this.productosExpandido.length / this.slidesPerView) - 1) * (100 / this.slidesPerView);

    if (this.offsetPercent < maxOffset) {
      this.offsetPercent = 0;
    }
  }

}
