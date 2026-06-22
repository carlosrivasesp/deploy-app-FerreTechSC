import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { MisPedidosComponent } from './components/pedidos/mis-pedidos/mis-pedidos.component';
import { DetallePedidoComponent } from './components/pedidos/detalle-pedido/detalle-pedido.component';
import { CheckoutComponent } from './components/checkout/checkout.component';


const routes: Routes = [
  // Rutas generales
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  //cliente
  { path: '', component: CatalogoComponent },
  { path: 'mis-pedidos', component: MisPedidosComponent },
  { path: 'carrito', component: CarritoComponent},
  { path: 'pedido/:id', component: DetallePedidoComponent },
  { path: 'checkout', component: CheckoutComponent},

  // Redirecciones
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
