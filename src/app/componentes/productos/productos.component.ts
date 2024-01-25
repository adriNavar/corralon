import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Producto } from 'src/app/modelos/producto.model';
import { ProductoServicio } from './../../servicios/producto.service';
import { SidebarService } from '../../servicios/sidebar.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  isSidebarOpen: boolean = false;

  productos: Producto[];
  producto: Producto = {
    nombre: '',
    // ... otros campos del producto
  };

  @ViewChild("productoForm") productoForm: NgForm;
  @ViewChild("botonCerrar") botonCerrar: ElementRef;
  @ViewChild("botonLimpiar") botonLimpiar: ElementRef;

  constructor(private productoServicio: ProductoServicio,
              private flashMessage: FlashMessagesService,
              private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.productoServicio.getProductos().subscribe(
      productos => {
        this.productos = productos;
      });
  }

  agregar({ value, valid }: { value: Producto, valid: boolean }) {
    if (!valid) {
      this.flashMessage.show('Por favor completar el formulario correctamente', {
        cssClass: 'alert-danger',
        timeout: 4000
      });
    } else {
      this.productoServicio.agregarProducto(value);
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

  toggleSidebar() {
    console.log('OPEN')
    this.sidebarService.toggleSidebar();
  }
}
