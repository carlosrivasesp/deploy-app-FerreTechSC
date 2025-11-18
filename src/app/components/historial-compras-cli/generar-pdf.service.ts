import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Operacion } from '../../models/operacion';
import { Venta } from '../../models/venta';

@Injectable({
  providedIn: 'root'
})
export class GenerarPDFService {

  generarComprobante(data: { pedido: Operacion, venta: Venta }) {

  const pedido = data.pedido;
  const venta = data.venta;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // =================================================
  // CONFIG DE PADDING
  // =================================================
  let y = 15;
  const left = 12;

  // =================================================
  // ENCABEZADO EMPRESA
  // =================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('FERRETERÍA SANTO CRISTO', left, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('RUC: 10091429077', left, y); y += 5;
  doc.text('AV. SANTO CRISTO NRO. C INT. 7 ASOC SANTO CRISTO', left, y); y += 5;
  doc.text('ALT. JR. CÁCERES - Santiago de Surco', left, y); y += 5;
  doc.text('Teléfono: (01) 2748870 | Cel: 997168712', left, y); y += 5;
  doc.text('Correo: ferreteriasantocristo@gmail.com', left, y); y += 8;

  doc.line(10, y, 200, y);
  y += 8;

  const tipo = venta.tipoComprobante;


  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(tipo.toUpperCase(), 158, 28, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  doc.text(`${venta.serie} - ${venta.nroComprobante}`, 158, 38, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Datos del Cliente', left, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Cliente       : ${pedido.cliente?.nombre}`, left, y); y += 6;
  doc.text(`Documento : ${pedido.cliente?.nroDoc || '---'}`, left, y); y += 6;
  doc.text(`Teléfono     : ${pedido.cliente?.telefono || '---'}`, left, y); y += 6;
  doc.text(`F. Emisión  : ${new Date(pedido.fechaEmision).toLocaleString()}`, left, y);
  y += 10;

  doc.line(10, y, 200, y);
  y += 10;

  const detalle = pedido.detalles.map((item: any) => [
    item.codInt || '',
    item.nombre,
    item.cantidad,
    `S/ ${item.precio.toFixed(2)}`,
    `S/ ${item.subtotal.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Código', 'Descripción', 'Cant.', 'P. Unit', 'Subtotal']],
    body: detalle,
    theme: 'grid',
    headStyles: { fillColor: [50, 50, 50], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 90 },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' }
    }
  });

  const yFin = (doc as any).lastAutoTable.finalY + 15;

  const opGravada = pedido.total - pedido.igv;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`OP. GRAVADA:`, 145, yFin);
  doc.text(`S/ ${opGravada.toFixed(2)}`, 195, yFin, { align: 'right' });

  doc.text(`IGV (18%):`, 145, yFin + 7);
  doc.text(`S/ ${pedido.igv.toFixed(2)}`, 195, yFin + 7, { align: 'right' });

  doc.text(`TOTAL:`, 145, yFin + 14);
  doc.text(`S/ ${pedido.total.toFixed(2)}`, 195, yFin + 14, { align: 'right' });

  // =================================================
  // PIE DE PÁGINA
  // =================================================
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text('Representación impresa del Comprobante Electrónico.', 10, 285);
  doc.text('Gracias por su preferencia.', 10, 291);

  // =================================================
  // GUARDAR ARCHIVO
  // =================================================
  const fileName = `${tipo.replace(/ /g, "_")}_${pedido.nroOperacion}.pdf`;
  doc.save(fileName);
}
}
