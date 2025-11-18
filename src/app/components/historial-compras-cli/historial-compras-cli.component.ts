import { Component, OnInit } from '@angular/core';
import { OperacionService } from '../../services/operacion.service';
import { GenerarPDFService } from './generar-pdf.service';
import { Operacion } from '../../models/operacion';
import { Venta } from '../../models/venta';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-historial-compras-cli',
  standalone: false,
  templateUrl: './historial-compras-cli.component.html',
  styleUrls: ['./historial-compras-cli.component.css'],
})
export class HistorialComprasCliComponent implements OnInit {
  compras: any[] = [];

  constructor(
    private operacionService: OperacionService,
    private pdfService: GenerarPDFService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const dni = localStorage.getItem('dniCliente');
    if (dni) {
      this.operacionService
        .obtenerHistorialPorCliente(dni)
        .subscribe((data) => {
          this.compras = data.reverse();
        });
    } else {
      console.error('No se encontró el DNI del cliente');
    }
  }
  generarPDF(pedido: Operacion) {
    this.ventaService.getVentaByPedidoId(pedido._id!).subscribe((venta) => {
      const data = { pedido, venta };

      this.pdfService.generarComprobante(data);
    });
  }
}
