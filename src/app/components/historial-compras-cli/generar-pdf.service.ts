import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class GenerarPDFService {

  generarComprobante(pedido: any) {

    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4'
    });

    // ==============================
    // ENCABEZADO EMPRESARIAL
    // ==============================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('FERRETERIA SANTO CRISTO', 10, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('RUC: 10091429077', 10, 22);
    doc.text('Dirección: AV. SANTO CRISTO NRO. C INT. 7 ASOC', 10, 28);
    doc.text('           SANTO CRISTO (ALT. JR. CACERES)', 10, 33);
    doc.text('Ciudad: Santiago de Surco', 10, 39);
    doc.text('Teléfono: (01) 2748870', 10, 45);
    doc.text('Celular: 997168712', 10, 51);
    doc.text('Correo: ferreteriaCarlos@gmail.com', 10, 57);

    // Línea divisoria elegante
    doc.setLineWidth(0.5);
    doc.line(10, 63, 200, 63);

    // ==============================
    // TIPO DE COMPROBANTE
    // ==============================
    const tipo = pedido.tipoComprobante || 'COMPROBANTE ELECTRÓNICO';

    doc.setFont('helvetica', 'bold');

    // Reducimos un poco el tamaño para que entre siempre
    doc.setFontSize(14);

    // Ajustamos el texto para que quepa sin cortar
    doc.text(tipo, 115, 20, { maxWidth: 80, align: 'left' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Serie: ${pedido.serie || '---'}`, 130, 27);
    doc.text(`N° Comprobante: ${pedido.nroComprobante || pedido.nroOperacion}`, 130, 34);

    // ==============================
    // DATOS DEL CLIENTE
    // ==============================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Datos del Cliente', 10, 75);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Cliente: ${pedido.cliente?.nombre}`, 10, 83);
    doc.text(`DNI: ${pedido.cliente?.nroDoc || '---'}`, 10, 90);
    doc.text(`Teléfono: ${pedido.cliente?.telefono || '---'}`, 10, 97);
    doc.text(`Fecha emisión: ${new Date(pedido.fechaEmision).toLocaleString()}`, 10, 104);

    // ==============================
    // DETALLE DEL COMPROBANTE
    // ==============================
    const detalle = pedido.detalles.map((item: any) => [
      item.codInt,
      item.nombre,
      item.cantidad,
      `S/ ${item.subtotal.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 115,
      head: [['Código', 'Descripción', 'Cantidad', 'Subtotal']],
      body: detalle,
      theme: 'grid',
      headStyles: { fillColor: [30, 30, 30] }, // Negro elegante
      styles: { fontSize: 10 }
    });

    // ==============================
    // TOTALES
    // ==============================
    const y = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`IGV: S/ ${pedido.igv.toFixed(2)}`, 150, y);
    doc.text(`TOTAL: S/ ${pedido.total.toFixed(2)}`, 150, y + 7);

    // ==============================
    // PIE DE PÁGINA
    // ==============================
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('Gracias por su compra.', 10, 285);
    doc.text('Comprobante generado electrónicamente.', 10, 290);

    // ==============================
    // GUARDAR
    // ==============================
    const fileName = `${tipo.replace(/ /g, "_")}_${pedido.nroOperacion}.pdf`;

    doc.save(fileName);
  }
}
