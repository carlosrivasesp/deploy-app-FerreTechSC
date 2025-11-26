import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';
import { Producto } from '../models/producto';

// export interface Producto {
//   _id: string;
//   codInt?: string;
//   nombre: string;
//   precio: number;
//   stockActual?: number;
//   stockMin?: number;
//   categoria?: string;
//   marca?: string;
//   estado?: string;
// }

export interface CartItem {
  producto: Producto;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface CarritoResponse {
  items: CartItem[];
  moneda: string;
  subtotal: number;
  igv: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'https://deploy-server-ferretechsc.onrender.com/api/carrito';  // Ajusta según tu URL backend

  private invitadoKey = "key_invitado" //key para determinar invitado

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Obtener los productos del carrito
  getCart(): Observable<CarritoResponse> {
    if (this.authService.getToken()) { //verifica si hay token, si hay, se llama a la API
      return this.http.get<CarritoResponse>(`${this.apiUrl}/`);
    }
    else { //Si no hay token, se muestra los items
      const items = this.cartInv();
      const response = this.calcularCartInv(items);
      return of(response);
    }
  }

  // Agregar un producto al carrito
  addItem(product: Producto, cantidad: number = 1): Observable<CarritoResponse> {
    if (this.authService.getToken()) { //consigue token y llama a la API
      return this.http.post<CarritoResponse>(`${this.apiUrl}/items`, { productId: product._id, cantidad });
    }
    else { //si no hay api, llama a los metodos de invitados para agregar al localStorage
      const items = this.cartInv();
      const buscarItems = items.find(i => i.producto._id === product._id); //busca los productos

      if (buscarItems) {
        buscarItems.cantidad += cantidad;
      } else {
        items.push({
          producto: product,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: cantidad
        });
      }
      this.saveCartInv(items); 
      return of(this.calcularCartInv(items));
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  setQty(productId: string|undefined, cantidad: number): Observable<CarritoResponse> {
    if(!productId){ //verifica la existencia del producto
      console.error("error al actualizar producto")
    }
    if (this.authService.getToken()) { //llama a la api 
      return this.http.patch<CarritoResponse>(`${this.apiUrl}/items/${productId}`, { cantidad });
    } else {
      const items = this.cartInv();
      const itemUpdate = items.find(i => i.producto._id === productId); //busca el item a actualizar

      if (itemUpdate) {
        itemUpdate.cantidad = cantidad; //actualiza la cantidad
      }

      this.saveCartInv(items); //guarda el item
      return of(this.calcularCartInv(items));
    }
  }

  removeItem(productId: string|undefined): Observable<CarritoResponse> {
    if(!productId){ //verifica la existencia del producto
      console.error("error al eliminar producto")
    }
    if (this.authService.getToken()) { //llama a la api
      return this.http.delete<CarritoResponse>(`${this.apiUrl}/items/${productId}`);
    } else {
      let items = this.cartInv();
      items = items.filter(i => i.producto._id !== productId);  //busca item

      this.saveCartInv(items);
      return of(this.calcularCartInv(items));
    }
  }
  // Procesar el checkout del carrito
  checkout(data: {
    tipoComprobante: string,
    metodoPago: string,
    cliente: string,
    servicioDelivery?: boolean
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkout`, data);
  }

  private cartInv(): CartItem[] {
    const itemsJson = localStorage.getItem(this.invitadoKey);
    return itemsJson ? JSON.parse(itemsJson) : [];
  }

  private saveCartInv(items: CartItem[]): void {
    localStorage.setItem(this.invitadoKey, JSON.stringify(items));
  }

  // private clearCartInv(): void {
  //   localStorage.removeItem(this.invitadoKey);
  // }

  private calcularCartInv(items: CartItem[]): CarritoResponse {
    let subtotal = 0;

    items.forEach(item => {
      subtotal += item.precio * item.cantidad;
    });

    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    return {
      items: items,
      moneda: 'S/',
      subtotal: parseFloat(subtotal.toFixed(2)),
      igv: parseFloat(igv.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    }
  }
}
