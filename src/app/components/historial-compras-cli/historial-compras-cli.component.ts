import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { GenerarPDFService } from './generar-pdf.service';
import { Pedido } from '../../models/pedido';
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
    private PedidoService: PedidoService,
    private pdfService: GenerarPDFService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const dni = localStorage.getItem('dniCliente');
    if (dni) {
      this.PedidoService
        .obtenerHistorialPorCliente(dni)
        .subscribe((data) => {
          this.compras = data.reverse();
        });
    } else {
      console.error('No se encontró el DNI del cliente');
    }
  }
  generarPDF(pedido: Pedido) {
    this.ventaService.getVentaByPedidoId(pedido._id!).subscribe((venta) => {
      const data = { pedido, venta };

      this.pdfService.generarComprobante(data);
    });
  }
}
