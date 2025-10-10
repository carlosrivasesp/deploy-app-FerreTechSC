import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { HistorialService } from '../../services/historial.service';
import { OperacionService } from '../../services/operacion.service';
@Component({
  selector: 'app-historial-carrito',
  standalone: false,
  templateUrl: './historial-carrito.component.html',
  styleUrls: ['./historial-carrito.component.css']
})
export class HistorialCarritoComponent implements OnInit {

  compras: any[] = [];

  constructor(private operacionService: OperacionService) {}

 ngOnInit(): void {
  this.cargarHistorial();
}

cargarHistorial(): void {
  const dni = localStorage.getItem('dniCliente'); 
  if (dni) {
    this.operacionService.obtenerHistorialPorCliente(dni).subscribe((data) => {
      this.compras = data;
    });
  } else {
    console.error('No se encontró el DNI del cliente');
  }
}

}
