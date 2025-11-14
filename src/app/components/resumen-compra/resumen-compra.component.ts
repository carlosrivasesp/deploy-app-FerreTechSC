import { Component, OnInit } from '@angular/core';
import { CarritoService, CartItem } from '../../services/carrito.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resumen-compra',
  standalone: false,
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
  clienteId: string|null=null;;
  nroDocError: string = '';
  clienteBloqueado: boolean = false;

  pedidoExitoso: boolean = false;
  tipoComprobante: string = 'BOLETA DE VENTA ELECTRONICA';
  metodoPago: string = 'Efectivo';

  metodosPagoConMercadoPago: string[] = ['Tarjeta de credito', 'Tarjeta de debito', 'Yape'];

  constructor(
    private carritoService: CarritoService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.verificarRetornoMercadoPago();
  }

  // Verificar si el usuario regresó de Mercado Pago
  verificarRetornoMercadoPago(): void {
    this.route.queryParams.subscribe((params) => {
      const status = params['status'];

      if (status) {
        if (status === 'success' || status === 'approved') {
          alert('✅ Pago aprobado. El pedido se procesará en breve.');
          // Limpiar parámetros de la URL
          this.router.navigate([], { relativeTo: this.route, queryParams: {} });
          // Aquí puedes actualizar el estado del pedido o mostrar un mensaje de éxito
        } else if (status === 'failure') {
          alert('❌ El pago fue rechazado. Por favor, intenta nuevamente.');
          this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        } else if (status === 'pending') {
          alert('⏳ El pago está pendiente. Te notificaremos cuando se apruebe.');
          this.router.navigate([], { relativeTo: this.route, queryParams: {} });
        }
      }
    });
  }

  loadCart(): void {
    this.carritoService.getCart().subscribe({
      next: (res) => {
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
    this.clienteBloqueado = false;
    this.pedidoExitoso = false;
  }

  onNroDocInput(): void {
    this.nroDocError = '';
    this.clienteBloqueado = false;
    this.pedidoExitoso = false;

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
            this.clienteId=res._id;
          } else {
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
          this.clienteId = null;
        },
      });
  }

  confirmarPedidoInvitado(): void {
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    if (this.tipoDoc === 'factura') {
      if (!this.nroDoc || this.nroDoc.length !== 11) {
        this.nroDocError = 'El RUC de 11 dígitos es obligatorio.';
        return;
      }
    }

    if (this.tipoDoc === 'DNI' && this.nroDoc.length !== 8) {
      this.nroDocError = 'El DNI debe tener 8 dígitos.';
      return;
    }

    if (!this.nroDoc || !this.nombre) {
      this.nroDocError = 'Nombre y Nro. Documento son obligatorios.';
      return;
    }

    if (this.requiereMercadoPago()) {
      this.crearPreferenciaMercadoPago();
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

    this.http
      .post('http://localhost:4000/api/operacion/pedido-invitado', pedido)
      .subscribe({
        next: (res) => {
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
          console.error('Error al registrar pedido:', err);
          alert('Error al registrar el pedido. Por favor, intenta nuevamente.');
        },
      });
  }

  requiereMercadoPago(): boolean {
    return this.metodosPagoConMercadoPago.includes(this.metodoPago);
  }

  // Crear preferencia de Mercado Pago Checkout Pro
  crearPreferenciaMercadoPago(): void {
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    if (!this.correo) {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }

    if (!this.nroDoc || !this.nombre) {
      alert('Nombre y Nro. Documento son obligatorios.');
      return;
    }

    // Preparar los items para Mercado Pago
    const items = this.cartItems.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: 'PEN',
    }));

    // Datos para enviar al backend que creará la preferencia
    const preferenciaData = {
      items: items,
      payer: {
        name: this.nombre,
        email: this.correo,
        identification: {
          type: this.tipoDoc === 'DNI' ? 'DNI' : 'RUC',
          number: this.nroDoc,
        },
        phone: {
          number: this.telefono || '',
        },
      },
      back_urls: {
        success: `${window.location.origin}/resumen-compra?status=success`,
        failure: `${window.location.origin}/resumen-compra?status=failure`,
        pending: `${window.location.origin}/resumen-compra?status=pending`,
      },
      auto_return: 'approved',
      external_reference: `pedido_${Date.now()}`,
      // IMPORTANTE: Métodos de pago permitidos (necesario para que las tarjetas de prueba funcionen)
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12, // Permitir hasta 12 cuotas
      },
      // IMPORTANTE: Configuración adicional para tarjetas de prueba
      statement_descriptor: 'FERRETECHSC',
      binary_mode: false, // Permitir estados pendientes
      // Datos adicionales para tu backend
      pedido_data: {
        tipoComprobante: this.tipoComprobante,
        metodoPago: this.metodoPago,
        cliente: {
          _id:this.clienteId || undefined,
          tipoDoc: this.tipoDoc,
          nroDoc: this.nroDoc,
          nombre: this.nombre,
          telefono: this.telefono,
          correo: this.correo,
          direccion: this.servicioDelivery ? this.direccion : '',
          distrito: this.servicioDelivery ? this.distrito : '',
        },
        detalles: this.cartItems.map((item) => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
        })),
        servicioDelivery: this.servicioDelivery,
        igv:this.igv,
        monto: this.totalPrice,
      },
    };

    this.http
      .post<any>('http://localhost:4000/api/mercado-pago/crear-preferencia', preferenciaData)
      .subscribe({
        next: (res: any) => {
          if (!res || res === null || res === undefined) {
            alert('Error: No se recibió respuesta del servidor.');
            return;
          }
          
          const initPoint = res.sandbox_init_point || res.init_point || res.initPoint;
          
          if (!initPoint) {
            console.error('Error: Respuesta del backend no contiene init_point');
            alert('Error: No se recibió la URL de pago de Mercado Pago.');
            return;
          }
          
          if (typeof initPoint !== 'string' || !initPoint.startsWith('http')) {
            alert('Error: La URL de pago no es válida.');
            return;
          }
          
          try {
            window.location.replace(initPoint);
          } catch (error) {
            console.error('Error al redirigir:', error);
            window.location.href = initPoint;
          }
        },
        error: (err) => {
          console.error('Error al crear preferencia de Mercado Pago:', err);
          
          if (err.status === 404) {
            alert('El endpoint del backend no está disponible. Verifica que el endpoint esté implementado.');
          } else if (err.status === 500) {
            const errorMessage = err.error?.message || err.error?.error || 'Error desconocido';
            alert(`Error en el servidor: ${errorMessage}`);
          } else if (err.status === 0) {
            alert('Error de conexión: No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
          } else {
            const errorMessage = err.error?.message || err.error?.error || 'Error desconocido';
            alert(`Error al crear la preferencia de pago: ${errorMessage}`);
          }
        },
      });
  }

}
