import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CarritoService, CartItem } from '../../services/carrito.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Declaraciones para Culqi Checkout
declare var CulqiCheckout: any;
declare var Culqi: any;

@Component({
  selector: 'app-resumen-compra',
  standalone: false, // Se mantiene el standalone: false como en tu original
  templateUrl: './resumen-compra.component.html',
  styleUrls: ['./resumen-compra.component.css'],
})
export class ResumenCompraComponent implements OnInit, AfterViewInit {
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

  // Variables para Culqi (Modo TEST)
  publicKey: string = 'pk_test_xxxxxxxxxxxxx'; // REEMPLAZA CON TU TEST_PUBLIC_KEY de Culqi
  culqiInstance: any = null;
  metodosPagoConCulqi: string[] = ['Tarjeta de credito', 'Tarjeta de debito', 'Yape'];

  constructor(
    private carritoService: CarritoService,
    private http: HttpClient
  , private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  } // Carga el carrito (usa el CarritoService)

  ngAfterViewInit(): void {
    // Esperar a que el script de Culqi se cargue completamente
    this.waitForCulqiScript();
  }

  // Método para esperar a que el script de Culqi esté disponible
  waitForCulqiScript(): void {
    let attempts = 0;
    const maxAttempts = 50; // Máximo 5 segundos (50 * 100ms)
    
    const checkCulqi = () => {
      if (typeof CulqiCheckout !== 'undefined') {
        this.initCulqi();
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkCulqi, 100);
        } else {
          console.error('CulqiCheckout no se cargó después de varios intentos. Verifica que el script esté incluido en index.html');
        }
      }
    };
    
    checkCulqi();
  }

  // Método para inicializar Culqi Checkout (Modo TEST)
  initCulqi(): void {
    if (typeof CulqiCheckout === 'undefined') {
      console.error(' Culqi Checkout no está cargado. Verifica que el script esté incluido.');
      return;
    }

    // Configuración de Culqi para modo TEST
    const settings = {
      title: 'FerreTechSC',
      currency: 'PEN',
      amount: Math.round(this.totalPrice * 100), // Convertir a centavos
      // order: '', // Para Yape, PagoEfectivo, etc., necesitas generar un order primero (solo en producción)
    };

    const client = {
      email: this.correo || '',
    };

    const paymentMethods = {
      tarjeta: true,
      yape: true,
      billetera: false,
      bancaMovil: false,
      agente: false,
      cuotealo: false,
    };

    const options = {
      lang: 'es',
      installments: true, // Habilitar cuotas
      modal: true, // Modal (popup)
      paymentMethods: paymentMethods,
      paymentMethodsSort: ['tarjeta', 'yape'], // Orden de métodos de pago
    };

    // Personalización con colores de la marca FerreTechSC
    const appearance = {
      variables: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeightNormal: '500',
        borderRadius: '8px',
        colorBackground: '#ffffff',
        colorPrimary: '#69d07f', // Verde brillante de FerreTechSC
        colorPrimaryText: '#000000',
        colorText: '#10401b', // Verde oscuro
        colorTextSecondary: '#333333',
        colorTextPlaceholder: '#727F96',
        colorIconTab: '#69d07f',
        colorLogo: 'dark',
      },
      rules: {
        '.Culqi-Button': {
          background: '#69d07f',
          color: '#000000',
          borderRadius: '8px',
        },
        '.Culqi-Button:hover': {
          background: '#5ac872',
        },
        '.Culqi-Main-Container': {
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
      },
    };

    const config = {
      settings,
      client,
      options,
      appearance,
    };

    try {
      this.culqiInstance = new CulqiCheckout(this.publicKey, config);
      this.culqiInstance.culqi = this.handleCulqiAction.bind(this);
      console.log('Culqi Checkout inicializado correctamente (Modo TEST)');
    } catch (error) {
      console.error('Error al inicializar Culqi:', error);
    }
  }

  // Handler para la respuesta de Culqi
  handleCulqiAction(): void {
    if (Culqi.token) {
      const token = Culqi.token.id;
      console.log('Token de Culqi creado (TEST):', token);
      // En modo TEST, este token es de prueba y no genera cobros reales
      this.procesarPagoConCulqi(token);
    } else if (Culqi.order) {
      const order = Culqi.order;
      console.log('Order de Culqi creada (TEST):', order);
      // Para métodos como Yape, PagoEfectivo, etc.
      this.procesarPagoConOrder(order);
    } else {
      console.error('Error en Culqi:', Culqi.error);
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    }
  }

  // Método para abrir el checkout de Culqi
  abrirCulqiCheckout(): void {
    // Validaciones antes de abrir Culqi
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    if (!this.correo) {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }

    // Verificar que CulqiCheckout esté disponible
    if (typeof CulqiCheckout === 'undefined') {
      // Intentar esperar a que el script se cargue
      let attempts = 0;
      const checkAndWait = () => {
        attempts++;
        if (typeof CulqiCheckout !== 'undefined') {
          // Si ya está cargado, continuar
          this.initCulqi();
          setTimeout(() => {
            if (this.culqiInstance && typeof this.culqiInstance.open === 'function') {
              this.culqiInstance.open();
            }
          }, 100);
        } else if (attempts < 20) {
          // Esperar hasta 2 segundos
          setTimeout(checkAndWait, 100);
        } else {
          alert('Culqi no está cargado. Por favor, recarga la página.\n\nVerifica:\n1. Tu conexión a internet\n2. Que el script esté en index.html');
          console.error('CulqiCheckout no está disponible después de esperar');
        }
      };
      checkAndWait();
      return;
    }

    // Verificar que la llave pública tenga formato válido (temporalmente permitimos placeholder para pruebas)
    if (!this.publicKey || !this.publicKey.startsWith('pk_')) {
      alert('⚠️ La llave pública debe empezar con pk_\n\nVerifica la configuración de la llave.');
      console.error('Public Key no configurada correctamente');
      return;
    }

    // Reinicializar Culqi con los valores actuales (email y monto actualizado)
    this.initCulqi();

    // Esperar un momento para asegurar que la inicialización se complete
    setTimeout(() => {
      try {
        if (this.culqiInstance && typeof this.culqiInstance.open === 'function') {
          this.culqiInstance.open();
        } else {
          console.error('Culqi no está inicializado o no tiene método open');
          alert('Error al inicializar Culqi. Verifica la consola para más detalles.');
        }
      } catch (error) {
        console.error('Error al abrir Culqi:', error);
        alert('Error al abrir el sistema de pagos. Por favor, intenta nuevamente.');
      }
    }, 100);
  }

  // Método para procesar el pago con token (tarjetas) - Modo TEST
  procesarPagoConCulqi(token: string): void {
    if (this.cartItems.length === 0) {
      console.error('El carrito está vacío.');
      return;
    }

    if (!this.nroDoc || !this.nombre) {
      alert('Nombre y Nro. Documento son obligatorios.');
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
      tokenCulqi: token, // Token de prueba que enviarás al backend
      monto: this.totalPrice,
      modoTest: true, // Indicador de que es modo test
    };

    console.log('📦 Enviando pedido con Culqi (TEST):', pedido);

    // AQUÍ DEBES LLAMAR A TU ENDPOINT DEL BACKEND QUE PROCESARÁ EL PAGO
    // Por ahora solo mostramos el token en consola (modo TEST)
    alert(`Token de prueba recibido: ${token}\n\n⚠️ Modo TEST: No se generarán cobros reales.\n\nEn el backend deberás procesar este token con la TEST_SECRET_KEY de Culqi.`);
  }

  // Método para procesar el pago con order (Yape, PagoEfectivo, etc.) - Modo TEST
  procesarPagoConOrder(order: any): void {
    console.log('Procesando pago con Order (TEST):', order);
    // Similar a procesarPagoConCulqi pero con el objeto order
    alert(`Order de prueba recibida. ID: ${order.id}\n\n⚠️ Modo TEST: No se generarán cobros reales.\n\nEn el backend deberás procesar esta order con la TEST_SECRET_KEY de Culqi.`);
  }

  // Método para verificar si el método de pago requiere Culqi
  requiereCulqi(): boolean {
    return this.metodosPagoConCulqi.includes(this.metodoPago);
  }

  loadCart(): void {
    this.carritoService.getCart().subscribe({
      next: (res) => {
        // Log para depurar el problema del carrito vacío
        console.log('Carrito cargado en resumen:', res);

        this.cartItems = res.items;
        this.moneda = res.moneda;
        this.subtotal = res.subtotal;
        this.igv = res.igv;
        this.totalPrice = res.total;
        
        // Reinicializar Culqi con el monto actualizado
        if (this.totalPrice > 0) {
          this.initCulqi();
        }
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

    // Si el método de pago requiere Culqi, abrir el checkout de Culqi
    if (this.requiereCulqi()) {
      this.abrirCulqiCheckout();
      return; // No continuar con el método tradicional
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
