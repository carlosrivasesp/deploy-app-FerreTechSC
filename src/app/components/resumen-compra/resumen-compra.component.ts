import { Component, OnInit } from '@angular/core';
import { CarritoService, CartItem } from '../../services/carrito.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resumen-compra',
  standalone: false, // Se mantiene el standalone: false como en tu original
  templateUrl: './resumen-compra.component.html',
  styleUrls: ['./resumen-compra.component.css'],
})
export class ResumenCompraComponent implements OnInit {
  cartItems: CartItem[] = [];
  moneda = 'S/';
  subtotal = 0;
  igv = 0;
  totalPrice = 0;

  tipoDoc: string = 'DNI';
  nroDoc: string = '';
  nombre: string = '';
  telefono: string = '';
  correo: string = '';
  servicioDelivery: boolean = false;
  direccion: string = '';
  distrito: string = '';

  nroDocError: string = '';
  clienteBloqueado: boolean = false;

  pedidoExitoso: boolean = false;
  tipoComprobante: string = 'BOLETA DE VENTA ELECTRONICA';
  metodoPago: string = 'Efectivo';

  constructor(
    private carritoService: CarritoService,
    private http: HttpClient
  , private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
    this.autocompletarClienteAutomatico();
  } // Carga el carrito (usa el CarritoService)

  loadCart(): void {
    this.carritoService.getCart().subscribe({
      next: (res) => {
        // Log para depurar el problema del carrito vacío
        console.log('🛒 Carrito cargado en resumen:', res);

        this.cartItems = res.items;
        this.moneda = res.moneda;
        this.subtotal = res.subtotal;
        this.igv = res.igv;
        this.totalPrice = res.total;
      },
      error: (err) => {
        console.error('Error cargando carrito en el resumen:', err);
      },
    });
  }
  onTipoDocChange(): void {
    this.nroDoc = '';
    this.nroDocError = '';
    this.limpiarDatosCliente();
    this.clienteBloqueado = false; // ✅ Desbloquear campos al cambiar el tipo
    this.pedidoExitoso = false; // ✅ Ocultar notificación si se edita
  }
autocompletarClienteAutomatico(): void {
  const dniGuardado = localStorage.getItem('dniCliente'); // 🔹 recupera el DNI guardado al hacer login

  if (dniGuardado) {
    this.tipoDoc = 'DNI';
    this.nroDoc = dniGuardado;
    console.log('🔎 DNI cargado automáticamente:', dniGuardado);

    // ✅ Llama automáticamente al backend para llenar los demás datos
    this.buscarClientePorDocumento();
  } else {
    console.warn('⚠️ No se encontró ningún DNI guardado en el localStorage.');
  }
}




  onNroDocInput(): void {
    this.nroDocError = ''; // Limpiar error en cada input
    this.clienteBloqueado = false; // ✅ Desbloquear inmediatamente si el usuario está editando
    this.pedidoExitoso = false; // ✅ Ocultar notificación si se edita

    if (this.tipoDoc === 'DNI') {
      if (this.nroDoc.length === 8) {
        this.buscarClientePorDocumento();
      } else if (this.nroDoc.length > 0) {
        this.nroDocError = 'El DNI debe tener 8 dígitos.';
        this.limpiarDatosCliente();
      } else {
        this.limpiarDatosCliente();
      }
    } else if (this.tipoDoc === 'RUC') {
      if (this.nroDoc.length === 11) {
        this.nroDocError = '';
        this.buscarClientePorDocumento();
      } else if (this.nroDoc.length > 0) {
        this.nroDocError = 'El RUC debe tener 11 dígitos.';
        this.limpiarDatosCliente();
      } else {
        this.limpiarDatosCliente();
      }
    }
  } 

  private limpiarDatosCliente(): void {
    this.nombre = '';
    this.telefono = '';
    this.correo = '';
    this.clienteBloqueado = false;
  }

  limpiarCamposCliente(ocultarNotificacion: boolean = true): void {
    this.tipoDoc = 'DNI';
    this.nroDoc = '';
    this.nombre = '';
    this.telefono = '';
    this.correo = '';
    this.servicioDelivery = false;
    this.direccion = '';
    this.distrito = '';
    this.nroDocError = '';
    this.clienteBloqueado = false; 
    if (ocultarNotificacion) {
      this.pedidoExitoso = false;
    }
    console.log('Campos de cliente limpiados.');
  } 

  buscarClientePorDocumento(): void {
    if (this.tipoDoc === 'DNI' && this.nroDoc.length !== 8) {
      this.nroDocError = 'El DNI debe tener 8 dígitos para buscar.';
      this.clienteBloqueado = false;
      return;
    }
    if (!this.nroDoc) {
      this.clienteBloqueado = false;
      return;
    }

    console.log(`Buscando ${this.tipoDoc}: ${this.nroDoc}`);

    this.http
      .get<any>(
        `http://localhost:4000/api/clientes/getClienteByNroDoc/${this.nroDoc}`
      )
      .subscribe({
        next: (res) => {
          if (res && res.nombre) {
            this.nombre = res.nombre;
            this.telefono = res.telefono || '';
            this.correo = res.correo || '';
            this.nroDocError = '';
            this.clienteBloqueado = true;
            console.log(
              'Cliente encontrado y autocompletado. Campos bloqueados.',
              res
            );
          } else {
            console.log(
              'Cliente no encontrado, el usuario debe digitar sus datos.'
            );
            this.nroDocError =
              'Cliente no encontrado. Por favor, complete sus datos.';
            this.limpiarDatosCliente();
            this.clienteBloqueado = false; 
          }
        },
        error: (err) => {
          console.error('Error al buscar cliente:', err);
          this.nroDocError =
            'Error al consultar el documento. Intente más tarde.';
          this.limpiarDatosCliente();
          this.clienteBloqueado = false;
        },
      });
  } 

  confirmarPedidoInvitado(): void {
    if (this.cartItems.length === 0) {
      console.error('El carrito está vacío.');
      return;
    }
    if (this.tipoDoc === 'factura') {
      if (!this.nroDoc || this.nroDoc.length !== 11) {
        console.error(
          'Para emitir factura, el RUC de 11 dígitos es obligatorio.'
        );
        this.nroDocError = 'El RUC de 11 dígitos es obligatorio.';
        return;
      }
    } 

    if (this.tipoDoc === 'DNI' && this.nroDoc.length !== 8) {
      console.error('El DNI debe tener 8 dígitos.');
      this.nroDocError = 'El DNI debe tener 8 dígitos.';
      return;
    }

    if (!this.nroDoc || !this.nombre) {
      console.error(
        'Error Frontend: El nombre y el Nro. de Documento no pueden estar vacíos.'
      );
      this.nroDocError = 'Nombre y Nro. Documento son obligatorios.';
      return;
    }

    const detalles = this.cartItems.map((item) => ({
      nombre: item.nombre,
      cantidad: item.cantidad, 
    }));

    const datosCliente = {
      tipoDoc: this.tipoDoc,
      nroDoc: this.nroDoc,
      nombre: this.nombre,
      telefono: this.telefono,
      correo: this.correo,
      direccion: this.servicioDelivery ? this.direccion : '',
      distrito: this.servicioDelivery ? this.distrito : '',
    };

    const pedido = {
      tipoComprobante: this.tipoComprobante,
      metodoPago: this.metodoPago,
      cliente: datosCliente,
      detalles: detalles,
      servicioDelivery: this.servicioDelivery,
    };

    console.log('📦 Enviando pedido invitado:', pedido);

    this.http
      .post('http://localhost:4000/api/operacion/pedido-invitado', pedido)
      .subscribe({
        next: (res) => {
          console.log('✅ Pedido registrado correctamente:', res);
          this.pedidoExitoso = true;
          setTimeout(() => {
            this.pedidoExitoso = false;
          }, 5000);

          localStorage.removeItem(this.carritoService['invitadoKey']);
          this.cartItems = [];
          this.subtotal = 0;
          this.igv = 0;
          this.totalPrice = 0;
          this.limpiarCamposCliente(false);
        },
        error: (err) => {
          console.error('❌ Error al registrar pedido:', err);
          console.error('Error al registrar el pedido. Revisa la consola.');
        },
      });
  }

}
