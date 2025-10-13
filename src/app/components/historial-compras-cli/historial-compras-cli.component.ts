import { Component, OnInit } from '@angular/core';
import { OperacionService } from '../../services/operacion.service';
@Component({
  selector: 'app-historial-compras-cli',
  standalone: false,
  templateUrl: './historial-compras-cli.component.html',
  styleUrls: ['./historial-compras-cli.component.css']
})
export class HistorialComprasCliComponent implements OnInit {

  compras: any[] = [];

  constructor(private operacionService: OperacionService) {}

 ngOnInit(): void {
  this.cargarHistorial();
}

cargarHistorial(): void {
  const dni = localStorage.getItem('dniCliente'); 
  if (dni) {
    this.operacionService.obtenerHistorialPorCliente(dni).subscribe((data) => {
      this.compras = data.reverse();
    });
  } else {
    console.error('No se encontró el DNI del cliente');
  }
}

}
