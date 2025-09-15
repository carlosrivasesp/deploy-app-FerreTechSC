import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { HistorialService } from '../../services/historial.service';

@Component({
  selector: 'app-historial-carrito',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe], 
  templateUrl: './historial-carrito.component.html',
  styleUrls: ['./historial-carrito.component.css']
})
export class HistorialCarritoComponent implements OnInit {

  compras: any[] = [];

  constructor(private historialService: HistorialService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.historialService.obtenerHistorial().subscribe((data) => {
      this.compras = data;
    });
  }
}
