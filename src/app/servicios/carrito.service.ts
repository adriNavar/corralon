import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrito {
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  // Estado privado del carrito
  private carrito: ItemCarrito[] = [];

  // BehaviorSubject para emitir cambios
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);

  // Observable público para suscribirse
  carrito$ = this.carritoSubject.asObservable();

  private itemParaEditarSubject = new BehaviorSubject<ItemCarrito | null>(null);
  itemParaEditar$ = this.itemParaEditarSubject.asObservable();

  constructor() {
    this.cargarCarritoDeLocalStorage();
  }
  private guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  private cargarCarritoDeLocalStorage() {
    const data = localStorage.getItem('carrito');
    if (data) {
      this.carrito = JSON.parse(data);
      this.carritoSubject.next([...this.carrito]);
    }
  }

  setItemParaEditar(item: ItemCarrito) {
    this.itemParaEditarSubject.next(item);
  }
  limpiarItemParaEditar() {
    this.itemParaEditarSubject.next(null);
  }


  reemplazarProducto(item: ItemCarrito) {
    const index = this.carrito.findIndex(i => i.productoId === item.productoId);
    if (index !== -1) {
      this.carrito[index] = item;
    }
    this.carritoSubject.next([...this.carrito]);
  }
  // Método para agregar un producto al carrito
  agregarProducto(item: ItemCarrito, esModificacion: boolean = false) {
    const index = this.carrito.findIndex(i => i.productoId === item.productoId);
    if (index !== -1) {
      if (esModificacion) {
        this.carrito[index].cantidad = item.cantidad;
      } else {
        this.carrito[index].cantidad += item.cantidad;
      }
    } else {
      this.carrito.push(item);
    }
    this.carritoSubject.next([...this.carrito]);
    this.guardarCarritoEnLocalStorage();
  }

  getTotal(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad * item.precioUnitario, 0);
  }

  limpiarCarrito() {
    this.carrito = [];
    this.carritoSubject.next([]);
    localStorage.removeItem('carrito');
  }
}


