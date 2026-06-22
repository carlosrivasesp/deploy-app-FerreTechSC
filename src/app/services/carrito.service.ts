import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private key = 'carrito';

  obtenerCarrito() {
    return JSON.parse(
      localStorage.getItem(this.key) || '[]'
    );
  }

  agregarProducto(producto: any) {

    const carrito = this.obtenerCarrito();

    const existente = carrito.find(
      (x: any) =>
        x.IdPresentacionVenta === producto.IdPresentacionVenta
    );

    if (existente) {

      existente.cantidad += 1;

    } else {

      carrito.push({
        IdPresentacionVenta: producto.IdPresentacionVenta,
        Producto: producto.Producto,
        PrecioVenta: producto.PrecioVenta,
        cantidad: 1
      });

    }

    localStorage.setItem(
      this.key,
      JSON.stringify(carrito)
    );
  }

  eliminarProducto(idPresentacionVenta: number) {

    const carrito = this.obtenerCarrito()
      .filter(
        (x: any) =>
          x.IdPresentacionVenta !== idPresentacionVenta
      );

    localStorage.setItem(
      this.key,
      JSON.stringify(carrito)
    );
  }

  vaciarCarrito() {

    localStorage.removeItem(this.key);

  }
}