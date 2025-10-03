import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  _id: string;
  codInt?: string;
  nombre: string;
  precio: number;
  stockActual?: number;
  stockMin?: number;
  categoria?: string;
  marca?: string;
  estado?: string;
}

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
  private apiUrl = 'http://localhost:4000/api/carrito';  // Ajusta según tu URL backend

  constructor(private http: HttpClient) { }

  // Obtener los productos del carrito
  getCart(): Observable<CarritoResponse> {
    return this.http.get<CarritoResponse>(`${this.apiUrl}/`);
  }

  // Agregar un producto al carrito
  addItem(productId: string, cantidad: number = 1): Observable<CarritoResponse> {
    return this.http.post<CarritoResponse>(`${this.apiUrl}/items`, { productId, cantidad });
  }

  // Actualizar la cantidad de un producto en el carrito
  setQty(productId: string, cantidad: number): Observable<CarritoResponse> {
    return this.http.patch<CarritoResponse>(`${this.apiUrl}/items/${productId}`, { cantidad });
  }

  // Eliminar un producto del carrito
  removeItem(productId: string): Observable<CarritoResponse> {
    return this.http.delete<CarritoResponse>(`${this.apiUrl}/items/${productId}`);
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
}
