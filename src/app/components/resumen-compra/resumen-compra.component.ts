import { Component, OnInit } from '@angular/core';
import { CarritoService, CartItem } from '../../services/carrito.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resumen-compra',
  standalone: false, // Se mantiene el standalone: false como en tu original
  templateUrl: './resumen-compra.component.html',
  styleUrls: ['./resumen-compra.component.css']
})
export class ResumenCompraComponent implements OnInit {
  cartItems: CartItem[] = [];
  moneda = 'S/';
  subtotal = 0;
  igv = 0;
  totalPrice = 0;

  // Datos del cliente invitado
  tipoDoc: string = 'DNI';
  nroDoc: string = '';
  nombre: string = '';
  telefono: string = '';
  correo: string = '';
  servicioDelivery: boolean = false;
  direccion: string = '';
  distrito: string = '';

  // Propiedades de estado añadidas para el requerimiento
  nroDocError: string = '';
  // ✅ NUEVA PROPIEDAD: Indica si el cliente fue autocompletado y no se debe editar.
  clienteBloqueado: boolean = false; 

  constructor(
    private carritoService: CarritoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Carga el carrito (usa el CarritoService)
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
      }
    });
  }

  /**
   * Se dispara cuando cambia el tipo de documento (DNI/Factura).
   * Limpia los campos para evitar inconsistencias y desbloquea.
   */
  onTipoDocChange(): void {
    this.nroDoc = '';
    this.nroDocError = '';
    this.limpiarDatosCliente();
    this.clienteBloqueado = false; // ✅ Desbloquear campos al cambiar el tipo
  }

  /**
   * CORREGIDO: Solo se llama a limpiarDatosCliente() si la longitud es incorrecta o está vacío.
   */
  onNroDocInput(): void {
    this.nroDocError = ''; // Limpiar error en cada input
    this.clienteBloqueado = false; // ✅ Desbloquear inmediatamente si el usuario está editando

    if (this.tipoDoc === 'DNI') {
      if (this.nroDoc.length === 8) {
        // Longitud correcta, buscar en API
        this.buscarClientePorDocumento();
      } else if (this.nroDoc.length > 0) {
        // Longitud incorrecta (mientras escribe)
        this.nroDocError = 'El DNI debe tener 8 dígitos.';
        this.limpiarDatosCliente(); // Limpiar si se está editando y no coincide
      } else {
        // Vacío
        this.limpiarDatosCliente();
      }
    } else if (this.tipoDoc === 'factura') {
      if (this.nroDoc.length === 11) {
        // Longitud correcta para RUC.
        this.nroDocError = '';
        // Opcional: Se puede llamar a buscarClientePorDocumento() aquí si el backend soporta RUC
      } else if (this.nroDoc.length > 0) {
        this.nroDocError = 'El RUC debe tener 11 dígitos.';
        this.limpiarDatosCliente(); // Limpiar si se está editando y no coincide
      } else {
        // Vacío
        this.limpiarDatosCliente();
      }
    }
  }

  // Limpia los datos autocompletados (privado, solo limpia nombre/teléfono/correo)
  private limpiarDatosCliente(): void {
    this.nombre = '';
    this.telefono = '';
    this.correo = '';
    this.clienteBloqueado = false; // ✅ Asegurar desbloqueo
  }

  /**
   * ✅ NUEVO MÉTODO: Limpia todos los campos del cliente.
   * (Este es el que se conecta al botón).
   */
  limpiarCamposCliente(): void {
    this.tipoDoc = 'DNI';
    this.nroDoc = '';
    this.nombre = '';
    this.telefono = '';
    this.correo = '';
    this.servicioDelivery = false;
    this.direccion = '';
    this.distrito = '';
    this.nroDocError = '';
    this.clienteBloqueado = false; // ✅ Desbloquear
    console.log('Campos de cliente limpiados.');
  }

  // 🔍 Buscar cliente en BD por documento
  buscarClientePorDocumento(): void {
    // Validaciones básicas (aunque onNroDocInput ya las hace)
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
      .get<any>(`http://localhost:4000/api/clientes/getClienteByNroDoc/${this.nroDoc}`)
      .subscribe({
        next: (res) => {
          if (res && res.nombre) {
            // Cliente encontrado
            this.nombre = res.nombre;
            this.telefono = res.telefono || '';
            this.correo = res.correo || '';
            this.nroDocError = ''; 
            this.clienteBloqueado = true; // ✅ Bloquear campos si el cliente existe
            console.log('Cliente encontrado y autocompletado. Campos bloqueados.', res);
          } else {
            // Cliente no encontrado
            console.log('Cliente no encontrado, el usuario debe digitar sus datos.');
            this.nroDocError = 'Cliente no encontrado. Por favor, complete sus datos.';
            this.limpiarDatosCliente();
            this.clienteBloqueado = false; // ✅ Asegurar desbloqueo
          }
        },
        error: (err) => {
          console.error('Error al buscar cliente:', err);
          this.nroDocError = 'Error al consultar el documento. Intente más tarde.';
          this.limpiarDatosCliente();
          this.clienteBloqueado = false; // ✅ Asegurar desbloqueo
        }
      });
  }

  // 🧾 Registrar pedido modo invitado (ACTUALIZADO con validación de Factura)
  confirmarPedidoInvitado(): void {
    if (this.cartItems.length === 0) {
      // Nota: Reemplazar alert() por un modal custom, alert() no funciona bien en producción.
      console.error('El carrito está vacío.');
      return;
    }

    // ACTUALIZADO: Validación de Factura (Req 2)
    if (this.tipoDoc === 'factura') {
      if (!this.nroDoc || this.nroDoc.length !== 11) {
        console.error('Para emitir factura, el RUC de 11 dígitos es obligatorio.');
        this.nroDocError = 'El RUC de 11 dígitos es obligatorio.';
        return;
      }
    }

    // Validación simple para DNI (aunque onNroDocInput ya valida)
    if (this.tipoDoc === 'DNI' && this.nroDoc.length !== 8) {
       console.error('El DNI debe tener 8 dígitos.');
       this.nroDocError = 'El DNI debe tener 8 dígitos.';
       return;
    }

    // Validación extra de frontend
    if (!this.nroDoc || !this.nombre) {
      console.error('Error Frontend: El nombre y el Nro. de Documento no pueden estar vacíos.');
      this.nroDocError = 'Nombre y Nro. Documento son obligatorios.';
      return;
    }

    // Generar lista de IDs de productos del carrito
       const detalles = this.cartItems.map(item => ({
      _id: item.producto._id, // Opcional, si lo necesitas en el backend
      nombre: item.nombre, // Necesario para la búsqueda en el backend
      cantidad: item.cantidad // Necesario para la lógica de stock y precios
    }));

    // Creamos el objeto 'cliente' anidado que el backend espera
    const datosCliente = {
      tipoDoc: this.tipoDoc,
      nroDoc: this.nroDoc,
      nombre: this.nombre,
      telefono: this.telefono,
      correo: this.correo,
      direccion: this.servicioDelivery ? this.direccion : '',
      distrito: this.servicioDelivery ? this.distrito : '',
    };

    // Construir el objeto del pedido (según tu backend)
    const pedido = {
      cliente: datosCliente, 
      detalles: detalles, // <--- AHORA CONTIENE NOMBRE Y CANTIDAD
      servicioDelivery: this.servicioDelivery,
    };



    console.log('📦 Enviando pedido invitado:', pedido);

    this.http.post('http://localhost:4000/api/operacion/pedido-invitado', pedido)
      .subscribe({
        next: (res) => {
          console.log('✅ Pedido registrado correctamente:', res);
          // Nota: Reemplazar alert() por un modal custom
          console.log('¡Pedido registrado correctamente!'); 

          // limpiar el carrito de invitado
          localStorage.removeItem(this.carritoService['invitadoKey']);
          // Limpiar visualmente el carrito
          this.cartItems = [];
          this.subtotal = 0;
          this.igv = 0;
          this.totalPrice = 0;
          this.limpiarCamposCliente(); // ✅ Limpiar campos del formulario después del pedido
        },
        error: (err) => {
          console.error('❌ Error al registrar pedido:', err);
          // Nota: Reemplazar alert() por un modal custom
          console.error('Error al registrar el pedido. Revisa la consola.');
        }
      });
  }
}

