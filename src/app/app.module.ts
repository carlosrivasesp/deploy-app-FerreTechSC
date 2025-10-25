import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

import { LOCALE_ID } from '@angular/core';
import localeEsPe from '@angular/common/locales/es-PE';
import { registerLocaleData } from '@angular/common';

import { CommonModule } from '@angular/common'; // <-- Necesario para *ngIf y ngStyle
import { TrackingPedidoComponent } from './components/tracking-pedido/tracking-pedido.component';


registerLocaleData(localeEsPe, 'es-PE');

//importacion para chartjs (graficas), las versiones se encuentran en el package.json
import { NgChartsModule } from 'ng2-charts';
import { FadeInDirective } from './directiva/fade-in.directive';
//componentes
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardAdmComponent } from './components/dashboard-adm/dashboard-adm.component';
import { HeaderComponent } from './components/header/header.component';
import { ListaComprobantesComponent } from './components/lista-comprobantes/lista-comprobantes.component';
import { ListaClientesComponent } from './components/lista-clientes/lista-clientes.component';
import { ListaProveedoresComponent } from './components/lista-proveedores/lista-proveedores.component';
import { ListaProductosComponent } from './components/lista-productos/lista-productos.component';
import { VentaComponent } from './components/venta/venta.component';
import { ListaMarcasComponent } from './components/lista-marcas/lista-marcas.component';
import { ListaCategoriasComponent } from './components/lista-categorias/lista-categorias.component';
import { DetalleComponent } from './components/detalle/detalle.component';
import { DetalleEntregaComponent } from './components/detalle-entrega/detalle-entrega.component';
import { EntregasComponent } from './components/entregas/entregas.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { IngresarProductosComponent } from './components/ingresar-productos/ingresar-productos.component';
import { SalidaProductosComponent } from './components/salida-productos/salida-productos.component';
import { CotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { FormsModule } from '@angular/forms';
import { PrincipalComponent } from './components/principal/principal.component';
import { NavbarPrincipalComponent } from './components/navbar-principal/navbar-principal.component';
import { RegistrarCompraComponent } from './components/registrar-compra/registrar-compra.component';
import { ListadoComprasComponent } from './components/listado-compras/listado-compras.component';
import { DetalleCompraComponent } from './components/detalle-compra/detalle-compra.component';
import { DetalleIngresoProductosComponent } from './components/detalle-ingreso-productos/detalle-ingreso-productos.component';
import { DetalleSalidaProductosComponent } from './components/detalle-salida-productos/detalle-salida-productos.component';
import { ListadoCotizacionesComponent } from './components/lista-cotizaciones/lista-cotizaciones.component';
import { DetalleCotizacionComponent } from './components/detalle-cotizacion/detalle-cotizacion.component';
import { ComprasSugeridasComponent } from './components/compras-sugeridas/compras-sugeridas.component';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';
import { DetalleDevolucionProductosComponent } from './components/detalle-devolucion-productos/detalle-devolucion-productos.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { HistorialCarritoComponent } from './components/historial-carrito/historial-carrito.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { ListaPedidosComponent } from './components/lista-pedidos/lista-pedidos.component';

//servicios para hacer la comprobacion de jwt en la parte del carrito :)
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/authInterceptor';
import { ResumenCompraComponent } from './components/resumen-compra/resumen-compra.component';
import { DetallePedidosComponent } from './components/detalle-pedidos/detalle-pedidos.component';
CarritoComponent

@NgModule({
  declarations: [
    AppComponent,
    FadeInDirective,
    SidebarComponent,
    SignupComponent,
    DashboardAdmComponent,
    ListaComprobantesComponent,
    ListaClientesComponent,
    ListaProveedoresComponent,
    ListaProductosComponent,
    VentaComponent,
    ForgotpasswordComponent,
    ListaMarcasComponent,
    ListaCategoriasComponent,
    DetalleComponent,
    DetalleEntregaComponent,
    EntregasComponent,
    ReportesComponent,
    IngresarProductosComponent,
    SalidaProductosComponent,
    CotizacionesComponent,
    PrincipalComponent,
    NavbarPrincipalComponent,
    RegistrarCompraComponent,
    ListadoComprasComponent,
    DetalleCompraComponent,
    DetalleIngresoProductosComponent,
    DetalleSalidaProductosComponent,
    ListadoCotizacionesComponent,
    DetalleCotizacionComponent,
    ComprasSugeridasComponent,
    DevolucionesComponent,
    DetalleDevolucionProductosComponent,
    CatalogoComponent,
    NosotrosComponent,
    CarritoComponent,
    HistorialCarritoComponent,
    ListaPedidosComponent,
    ResumenCompraComponent,
    DetallePedidosComponent,
    LoginComponent,
    HeaderComponent,
    TrackingPedidoComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    CommonModule


  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


