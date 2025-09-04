import { Component } from '@angular/core';

@Component({
  selector: 'app-principal',
  standalone: false,
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent {
  productos = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  productosExpandido = [...this.productos, ...this.productos]; // Para loop infinito visual

  offsetPercent = 0; // % de desplazamiento del track
  slidesPerView = 6; // Número de slides visibles
  slideWidth = '16.66%'; // Ancho de cada slide (100% / 6)

  constructor() {
    this.updateSlideWidth();
  }


productosMasVendidos = [
  { nombre: 'Producto 1', precio: 50 },
  { nombre: 'Producto 2', precio: 65 },
  { nombre: 'Producto 3', precio: 80 },
  { nombre: 'Producto 4', precio: 40 },
  { nombre: 'Producto 5', precio: 90 },
  { nombre: 'Producto 6', precio: 75 },
  { nombre: 'Producto 7', precio: 55 },
  { nombre: 'Producto 8', precio: 99 }
];


  // Ajusta slidesPerView y slideWidth según ancho de pantalla
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
    const maxOffset =
      -((this.productosExpandido.length / this.slidesPerView) - 1) * (100 / this.slidesPerView);

    if (this.offsetPercent < maxOffset) {
      this.offsetPercent = 0;
    }
  }

  // Escuchar resize para recalcular responsive
  ngOnInit() {
    this.updateSlideWidth();
    window.addEventListener('resize', () => {
      this.updateSlideWidth();
    });
  }
}
