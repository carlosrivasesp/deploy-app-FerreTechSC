import { Component } from '@angular/core';

type Estado = 'Pendiente' | 'Completado';
type Tipo = 'Boleta' | 'Factura';

interface Item {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface Compra {
  tipo: Tipo;
  numero: string;   // Ej: F001-0002
  estado: Estado;
  monto: number;
  fecha: Date;
  items?: Item[];
}

@Component({
  selector: 'app-historial-carrito',
  templateUrl: './historial-carrito.component.html',
  styleUrls: ['./historial-carrito.component.css'],
  standalone : false
})
export class HistorialCarritoComponent {
  filtroComprobante = '';
  filtroEstado = ''; // '', 'Pendiente', 'Completado'
  ordenMonto: '' | 'asc' | 'desc' = '';


  seleccionado: Compra | null = null;

  compras: Compra[] = [
    {
      tipo: 'Boleta',
      numero: 'B001-0001',
      estado: 'Pendiente',
      monto: 120.5,
      fecha: new Date('2025-08-10T10:15:00'),
      items: [
        { nombre: 'Taladro percutor', cantidad: 1, precio: 100 },
        { nombre: 'Guantes', cantidad: 1, precio: 20.5 }
      ]
    },
    {
      tipo: 'Factura',
      numero: 'F001-0002',
      estado: 'Completado',
      monto: 450,
      fecha: new Date('2025-08-12T14:30:00'),
      items: [
        { nombre: 'Cemento x 42.5kg', cantidad: 5, precio: 90 }
      ]
    },
    {
      tipo: 'Boleta',
      numero: 'B001-0003',
      estado: 'Completado',
      monto: 230.75,
      fecha: new Date('2025-08-20T09:05:00'),
      items: [
        { nombre: 'Alambre galvanizado', cantidad: 3, precio: 50.25 },
        { nombre: 'Cinta métrica', cantidad: 1, precio: 80 }
      ]
    }
  ];

  comprasFiltradas(): Compra[] {
    let lista = this.compras.slice();

    // Filtro por N° comprobante
    const q = this.filtroComprobante.trim().toLowerCase();
    if (q) {
      lista = lista.filter(c => c.numero.toLowerCase().includes(q));
    }

    // Filtro por estado
    if (this.filtroEstado) {
      lista = lista.filter(c => c.estado === this.filtroEstado);
    }

    // Orden por monto
    if (this.ordenMonto === 'asc') {
      lista.sort((a, b) => a.monto - b.monto);
    } else if (this.ordenMonto === 'desc') {
      lista.sort((a, b) => b.monto - a.monto);
    }

    return lista;
  }

  verDetalles(compra: Compra) {
    this.seleccionado = compra;
  }
}
