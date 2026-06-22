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

import { CommonModule } from '@angular/common';

registerLocaleData(localeEsPe, 'es-PE');

//componentes
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MisPedidosComponent } from './components/pedidos/mis-pedidos/mis-pedidos.component';
import { DetallePedidoComponent } from './components/pedidos/detalle-pedido/detalle-pedido.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
CarritoComponent

@NgModule({
  declarations: [
    AppComponent,
    CatalogoComponent,
    CarritoComponent,
    RegisterComponent,
    MisPedidosComponent,
    DetallePedidoComponent,
    FooterComponent,
    NavbarComponent,
    LoginComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-PE'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


