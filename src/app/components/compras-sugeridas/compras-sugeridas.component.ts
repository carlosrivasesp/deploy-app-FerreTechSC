import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { OrdenCompraService } from '../../services/ordenCompra.service';
// import { CompraSugeridaService } from '../../services/compraS.service';
import { CompraSugerida } from '../../models/compraS';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta';
import { forkJoin } from 'rxjs';
import { OrdenCompra } from '../../models/ordenCompra';

@Component({
  selector: 'app-compras-sugeridas',
  standalone: false,
  templateUrl: './compras-sugeridas.component.html',
  styleUrl: './compras-sugeridas.component.css'
})
export class ComprasSugeridasComponent {
  listVentas: Venta[] = [];
  listProductos: Producto[] = [];
  listPocoStock: Producto[] = [];
  listOrdenes: OrdenCompra[] = [];
  productosMasVendidos: string[] = [];
  cantidades: number[] = [];

  listCompraSugerida: any[] = [];
  compraForm: FormGroup;
  selectedFilter: string = 'nombre'; // Por defecto se filtra por nombre
  searchTerm: string = '';

  isLoading = false;

  constructor(
    private _ventaService: VentaService,
    private _productoService: ProductoService,
    private _ordenCompraService: OrdenCompraService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    // private _compraSugService: CompraSugeridaService, 
    private aRoute: ActivatedRoute) {
    this.compraForm = this.fb.group({
      tipoComprobante: ['BOLETA DE COMPRA ELECTRONICA', Validators.required],
      serie: ['B01', Validators.required],
      nroComprobante: [''],
      fechaEmision: [this.getTodayString(), Validators.required],
      fechaVenc: [this.getTodayString(), Validators.required],
      total: ['', Validators.required],
      estado: ['Pendiente', Validators.required],
      moneda: ['S/', Validators.required],
      tipoCambio: ['3.66', Validators.required],
      proveedor: ['', Validators.required],
      igv: ['', Validators.required],
      metodoPago: ['', Validators.required],
      detalleC: this.fb.array([]),
    })
  }

  private generando = false;


  ngOnInit(): void {
    this.cargarDatosYCalcular();
  }
  cargarDatosYCalcular() {
    this.isLoading = true;
    forkJoin({
      ventas: this._ventaService.getAllVentas(),
      productos: this._productoService.getAllProductos(),
      pocoStock: this._productoService.getProductosPocoStock(),
      ordenes: this._ordenCompraService.getAllCompras(),
    }).subscribe({
      next: ({ ventas, productos, pocoStock, ordenes }) => {
        this.listVentas = ventas;
        this.listProductos = productos;
        this.listPocoStock = pocoStock;
        this.listOrdenes = ordenes;

        this.procesarProductosMasVendidos();
        this.construirListaSugeridaUnificada();

        this.isLoading = false;

      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al calcular sugerencias', 'Error de Datos');
        this.isLoading = false;
      }
    });
  }

  // Procesamos las ventas para obtener los productos más vendidos del mes actual
  procesarProductosMasVendidos() {
    const cantidadesPorProducto: { [nombre: string]: number } = {};
    const now = new Date();
    const mesActual = now.getMonth();
    const añoActual = now.getFullYear();

    // Recorremos las ventas para contar las cantidades vendidas por producto
    this.listVentas.forEach(venta => {
      if (venta.estado === 'Registrado' && venta.detalles && venta.detalles.length) {
        const fechaEmision = new Date(venta.fechaEmision!);
        if (fechaEmision.getMonth() === mesActual && fechaEmision.getFullYear() === añoActual) {
          venta.detalles.forEach(detalle => {
            cantidadesPorProducto[detalle.nombre] = (cantidadesPorProducto[detalle.nombre] || 0) + detalle.cantidad;
          });
        }
      }
    });

    const productosOrdenados = Object.entries(cantidadesPorProducto)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.productosMasVendidos = productosOrdenados.map(item => item[0]);
    this.cantidades = productosOrdenados.map(item => item[1]);
  }

  // Obtenemos un array de productos más vendidos con sus cantidades
  obtenerProductosMasVendidosArray() {
    const resultado: any[] = [];
    // Recorremos los nombres de productos más vendidos y buscamos los detalles en la lista de productos
    this.productosMasVendidos.forEach((nombre, index) => {
      const producto = this.listProductos.find(p => p.nombre === nombre);
      if (producto) {
        resultado.push({
          ...producto,
          cantidadVendidaCalculada: this.cantidades[index]
        });
      }
    });
    return resultado;
  }

  // Construimos la lista unificada de sugerencias de compra
  construirListaSugeridaUnificada() {
    const sugeridosMap = new Map<string, any>();

    this.listPocoStock.forEach(prod => {
      if (prod._id) {
        sugeridosMap.set(prod._id, {
          _id: prod._id,
          producto: prod,
          motivo: 'Poco stock',
          fechaSugerencia: new Date(),
          cantidadVendida: 0,
          generado: false
        });
      }
    });

    // Procesamos los productos más vendidos
    const masVendidos = this.obtenerProductosMasVendidosArray();

    masVendidos.forEach(prod => {
      const idProd = prod._id || prod.id;
      if (idProd) {
        // Si el producto ya está en el mapa actualizamos el motivo
        if (sugeridosMap.has(idProd)) {
          const existente = sugeridosMap.get(idProd);
          existente.motivo = 'Poco stock y Alta demanda';
          existente.cantidadVendida = prod.cantidadVendidaCalculada;
        } else {
          // Si no esta el producto, lo añadimos
          sugeridosMap.set(idProd, {
            _id: idProd,
            producto: prod,
            motivo: 'Alta demanda',
            fechaSugerencia: new Date(),
            cantidadVendida: prod.cantidadVendidaCalculada,
            generado: false
          });
        }
      }
    });
    // Convertimos el mapa a un array unificado con los productos de poco stock y los más vendidos
    this.listCompraSugerida = Array.from(sugeridosMap.values());
    this.restaurarEstadoGenerado();
    console.log('Lista unificada: ', this.listCompraSugerida);
  }


  async registrarCompraAutomatica(idProducto?: string) {
    if (!idProducto) {
      console.error('ID de producto no proporcionado para la compra automática.');
      return;
    }

    const productoData = this.listCompraSugerida.find(s => s.producto._id === idProducto);
    if (!productoData) return;

    this.toastr.info('Registrando compras, por favor espera...', '', { disableTimeOut: true, tapToDismiss: false });
    this.isLoading = true;

    const productosPorProveedor: Map<string, { proveedor: any, detalle: any[] }> = new Map();

    if (productoData) {
      const producto = productoData.producto;
      const proveedor = producto?.marca?.proveedor;

      if (!proveedor || !proveedor._id) {
        this.isLoading = false;
        return;
      }
      const proveedorId = proveedor._id;
      if (!productosPorProveedor.has(proveedorId)) {
        productosPorProveedor.set(proveedorId, { proveedor, detalle: [] });
      }

      productosPorProveedor.get(proveedorId)!.detalle.push({
        producto: producto._id,
        codInt: producto.codInt,
        nombre: producto.nombre,
        cantidad: 30,
        precio: producto.precio,
        subtotal: 30 * producto.precio
      });
    };
    let exitoTotal = false;
    const proveedoresArray = Array.from(productosPorProveedor.values());

    for (const { proveedor, detalle } of proveedoresArray) {
      const total = detalle.reduce((sum, item) => sum + item.subtotal, 0);
      const igv = parseFloat((total * 0.18).toFixed(2));
      const totalConIgv = parseFloat((total + igv).toFixed(2));

      const compra: OrdenCompra = {
        codigo: '',
        fechaCreacion: new Date(),
        total: totalConIgv,
        estado: 'Pendiente',
        proveedor: proveedor._id,
        detalles: detalle,
        ingresos: [],
      };

      try {
        console.log(`Registrando compra para proveedor ${proveedor.nombre}`, compra);
        const compraRegistrada = await this._ordenCompraService.registrarCompra(compra).toPromise();
        console.log('DATA GENERADA: ', productoData);
        this.toastr.success(`Compra registrada para el proveedor ${proveedor.nombre}`);
        if (!compraRegistrada) {
          console.error(`No se pudo registrar la compra para el proveedor ${proveedor.nombre}`);
          return;
        }
        exitoTotal = true;
        if (exitoTotal) {
          productoData.generado = true;
          const estados = this.listCompraSugerida
            .filter(s => s.generado)
            .map(s => ({ id: s.producto._id, generado: true }));

          localStorage.setItem('sugerencias_generadas', JSON.stringify(estados));

        }
        if (compraRegistrada) {
          this.listOrdenes = await this._ordenCompraService.getAllCompras().toPromise();
          this.restaurarEstadoGenerado();
        }

      } catch (error) {
        console.error(`Error al registrar compra para proveedor ${proveedor.nombre}:`, error);
        this.toastr.error('Error al registrar la compra');
      }
    }

    this.isLoading = false;
    this.toastr.clear();
    this.router.navigate(['/listado-compras']);
  }

  private restaurarEstadoGenerado() {    
    this.listCompraSugerida = this.listCompraSugerida.filter(item => {
      const idProducto = item.producto._id;
      const ordenExiste = this.listOrdenes.find((orden: OrdenCompra) => {
        return orden.detalles.some(detalle => {
          const idDetalle = (typeof detalle.producto === 'object' && detalle.producto !== null)
            ? (detalle.producto as any)._id
            : detalle.producto;
            
          return idDetalle === idProducto;
        });
      });
      if(ordenExiste){
        if((ordenExiste.ingresos?.length??0)>0 && ordenExiste.estado==='Aprobada'){
          return false;
        }
      }
      item.generado = false;
      item.aprobado = false;

      if (ordenExiste) {
        if (ordenExiste.estado === 'Pendiente') {
          item.generado = true; 
        } else if (ordenExiste.estado === 'Aprobada') {
          item.aprobado = true;
        }
      }
      return true;
    });
  }


  get filteredCompraS(): CompraSugerida[] {
    if (!this.searchTerm.trim()) {
      return this.listCompraSugerida;
    }

    const term = this.searchTerm.trim().toLowerCase();

    switch (this.selectedFilter) {
      case 'nombre':
        return this.listCompraSugerida.filter(p =>
          p.producto.nombre.toLowerCase().startsWith(term)
        );
      case 'marca':
        return this.listCompraSugerida.filter(p =>
          p.producto.marca.nombre.toLowerCase().startsWith(term)
        );
      default:
        return this.listCompraSugerida;
    }
  }

  currentPage: number = 1;
  itemsPerPage: number = 10;

  get paginated(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCompraS.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCompraS.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private getTodayString(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');  // Añade un cero al inicio si el día es menor a 10
    const month = String(today.getMonth() + 1).padStart(2, '0');  // `getMonth()` es cero-indexado, por eso sumamos 1
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;  // DD-MM-YYYY
  }
}
