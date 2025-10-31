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

  private urlTracking = 'http://localhost:4000/api/tracking';

  // Estados del pedido para mostrar en la interfaz
  estados = [
    { nombre: 'Recibido', icono: 'bi bi-inbox' },
    { nombre: 'En Preparación', icono: 'bi bi-gear' },
    { nombre: 'Enviado', icono: 'bi bi-truck' },
    { nombre: 'Entregado', icono: 'bi bi-check-circle' }
  ];

  indiceEstado: number = 0;
  progreso: number = 0;

  constructor(private http: HttpClient) {}

  // Método principal: buscar tracking por código
  buscarTracking() {
    if (!this.trackingCode.trim()) {
      this.errorMessage = 'Por favor, ingrese un código de seguimiento.';
      this.trackingData = null;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.trackingData = null;

    this.http.get(`${this.urlTracking}/${this.trackingCode}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.trackingData = response.data;
          this.actualizarProgreso();
        } else {
          this.errorMessage = response.message || 'No se encontró información.';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al consultar tracking:', error);
        this.errorMessage = error.error?.message || 'Error del servidor.';
        this.loading = false;
      }
    });
  }

  // Actualiza la barra de progreso según el estado del pedido
  private actualizarProgreso() {
    if (!this.trackingData || !this.trackingData.estado) return;

    const indice = this.estados.findIndex(e => e.nombre === this.trackingData.estado);
    this.indiceEstado = indice + 1;
    this.progreso = ((indice + 1) / this.estados.length) * 100;
  }
}
