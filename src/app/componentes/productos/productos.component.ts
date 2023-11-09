import { FlashMessage } from 'angular2-flash-messages/module/flash-message';
import { ProductoServicio } from './../../servicios/producto.service'; // Cambiado a ProductoServicio
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Producto } from 'src/app/modelos/producto.model'; // Cambiado a Producto
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-productos', // Cambiado a 'productos'
  templateUrl: './productos.component.html', // Cambiado a 'productos.component.html'
  styleUrls: ['./productos.component.css'] // Cambiado a 'productos.component.css'
})
export class ProductosComponent implements OnInit {

  productos: Producto[]; // Cambiado a Producto
  producto: Producto = {
    nombre: '',
    // ... otros campos del producto
  };

  @ViewChild("productoForm") productoForm: NgForm; // Cambiado a productoForm
  @ViewChild("botonCerrar") botonCerrar: ElementRef;
  @ViewChild("botonLimpiar") botonLimpiar: ElementRef;

  constructor(private productoServicio: ProductoServicio, // Cambiado a ProductoServicio
              private flashMessage: FlashMessagesService) { }

  ngOnInit(): void {
    this.productoServicio.getProductos().subscribe(
      productos => {
        this.productos = productos;
      });
  }

  // getSaldoTotal() {
  //   let saldoTotal: number = 0;
  //   if (this.productos) {
  //     this.productos.forEach(producto => { // Cambiado a producto
  //       saldoTotal += producto.saldo; // Cambiado a producto
  //     });
  //   }
  //   return saldoTotal;
  // }

  agregar({ value, valid }: { value: Producto, valid: boolean }) { // Cambiado a Producto
    if (!valid) {
      this.flashMessage.show('Por favor completar el formulario correctamente', {
        cssClass: 'alert-danger',
        timeout: 4000
      });
    } else {
      this.productoServicio.agregarProducto(value); // Cambiado a agregarProducto
      this.productoForm.resetForm();
      this.cerrarModal();
    }
  }

  cerrarModal() {
    this.botonCerrar.nativeElement.click();
  }

  limpiar() {
    this.botonLimpiar.nativeElement.click();
  }

  resetForm() {
    this.productoForm.resetForm();
    this.cerrarModal();
  }
}
