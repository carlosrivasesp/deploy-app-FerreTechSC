import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Producto } from "../models/producto";

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    url = 'http://localhost:4000/api/productos';

    constructor(private http: HttpClient) { }

    getAllProductos(): Observable<any> {
        let direccionUrl = this.url;
        return this.http.get<Producto>(direccionUrl);
    }

    deleteProducto(id: string): Observable<any> {
        let direccionUrl = this.url;
        return this.http.delete<Producto>(direccionUrl + '/' + id);
    }

    guardarProducto(producto: Producto): Observable<any> {
        let direccionUrl = this.url;
        return this.http.post<Producto>(direccionUrl, producto);
    }

    obtenerProducto(id: string): Observable<any> {
        let direccionUrl = this.url;
        return this.http.get<Producto>(direccionUrl + '/' + id);
    }

    editarProducto(id: string, producto: Producto): Observable<any> {
        let direccionUrl = this.url;
        return this.http.put<Producto>(direccionUrl + '/' + id, producto);
    }

    getProductosPorProveedor(idProveedor: string): Observable<any> {
    const direccionUrl = this.url + '/proveedor';
    return this.http.get<Producto[]>(direccionUrl + '/' + idProveedor);
    }

    getProductosPorProveedorSinStock(idProveedor: string): Observable<any> {
    const direccionUrl = this.url + '/proveedor/sinStock';
    return this.http.get<Producto[]>(direccionUrl + '/' + idProveedor);
    }

    getProductosPocoStock(): Observable<any> {
    const direccionUrl = this.url + 'stock/poco';
    return this.http.get<Producto[]>(direccionUrl);
    }


}
