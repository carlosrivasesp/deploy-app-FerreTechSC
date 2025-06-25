import { Component } from '@angular/core';
import { Entregas } from '../../models/entregas';
import { EntregaService } from '../../services/entregas.service';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entregas',
  standalone: false,
  templateUrl: './entregas.component.html',
  styleUrl: './entregas.component.css'
})
export class EntregasComponent {

  listaEntregas: Entregas[] = [];
  entregaSeleccionada: any = null;

  direccion: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(
    private _entregasService: EntregaService,
    private toastr: ToastrService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.obtenerEntregas();
    this.entregaSeleccionada = null;
  }

  obtenerEntregas() {
    this._entregasService.getAllEntregas().subscribe({
      next: (data) => {
        this.listaEntregas = data.reverse();
      },
      error: (err) => {
        console.error('Error al obtener entregas', err);
      }
    });
  }
  cambiarEstado(entregaId: string, nuevoEstado: string) {
    const payload: any = {
      estado: nuevoEstado,
      direccion: this.direccion,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    };

    this._entregasService.editarEstado(entregaId, payload).subscribe({
      next: (res) => {
        if (nuevoEstado === "En proceso") {
          this.toastr.success('Entrega programada', 'Éxito');
        } else if (nuevoEstado === "Finalizado") {
          this.toastr.success('Entrega finalizada', 'Éxito');
        }

        const modalElement = document.getElementById('modalEdit');
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        modal?.hide();

        // Limpiar los inputs después de cerrar el modal (opcional)
        this.direccion = '';
        this.fechaInicio = '';
        this.fechaFin = '';

        this.obtenerEntregas();
      },
      error: (err) => {
        this.toastr.error('Error al cambiar estado.', 'Error');
        console.error('Error actualizando estado', err);
        alert(err.error?.mensaje || 'Error al actualizar estado');
      }
    });
  }

}

