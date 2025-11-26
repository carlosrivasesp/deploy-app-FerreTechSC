import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tracking',
  standalone: false,
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent {

  trackingCode: string = '';
  trackingData: any = null;
  loading: boolean = false;
  errorMessage: string = '';

  private urlTracking = 'https://deploy-server-ferretechsc.onrender.com/api/tracking';

  estados = [
    { nombre: 'Recibido', icono: 'bi bi-inbox' },
    { nombre: 'En Preparacion', icono: 'bi bi-gear' },
    { nombre: 'Enviado', icono: 'bi bi-truck' },
    { nombre: 'Entregado', icono: 'bi bi-check-circle' }
  ];

  indiceEstado: number = 0;
  progreso: number = 0;
  animacion: boolean = false;

  constructor(private http: HttpClient) {}

  buscarTracking() {
    if (!this.trackingCode.trim()) {
      this.errorMessage = 'Por favor, ingrese un código de seguimiento.';
      this.trackingData = null;
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.trackingData = null;
    this.animacion = false;

    this.http.get(`${this.urlTracking}/${this.trackingCode}`).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.trackingData = response.data;
          this.actualizarProgreso();
        } else {
          this.errorMessage = response.message || 'No se encontró información.';
        }
      },
      error: (error) => {
        console.error('Error al consultar tracking:', error);
        this.errorMessage = error.error?.message || 'Error del servidor.';
        this.loading = false;
      }
    });
  }

  private actualizarProgreso() {
    if (!this.trackingData?.estado) return;

    const indice = this.estados.findIndex(e => e.nombre === this.trackingData.estado);
    this.indiceEstado = indice + 1;
    this.progreso = ((indice + 1) / this.estados.length) * 100;

    // Actualiza la variable CSS para la animación
    document.documentElement.style.setProperty('--target-width', this.progreso + '%');

    // Activa la animación (relleno + carrito) una sola vez
    setTimeout(() => this.animacion = true, 50);
  }
}
