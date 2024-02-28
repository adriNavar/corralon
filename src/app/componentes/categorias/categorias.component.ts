import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Categoria } from 'src/app/modelos/categoria.model'; // Importa la clase Categoria
import { CategoriaServicio } from './../../servicios/categoria.service';
import { SidebarService } from 'src/app/servicios/sidebar.service';

@Component({
  selector: 'app-categorias',  // Asegúrate de que sea 'app-categorias' o el selector correcto
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})

export class CategoriasComponent implements OnInit {
  isSidebarOpen: boolean = false;
  categorias: Categoria[]; // Cambia el tipo de dato de productos a Categoria
  categoria: Categoria = {
    // No asignes un valor a id_categoria, Angular lo inicializará a undefined
    nombre: '',
  };

  @ViewChild("categoriaForm") categoriaForm: NgForm;
  @ViewChild("botonCerrar") botonCerrar: ElementRef;
  @ViewChild("botonLimpiar") botonLimpiar: ElementRef;

  constructor(private categoriaServicio: CategoriaServicio, // Cambia el servicio a CategoriaServicio
              private flashMessage: FlashMessagesService,
              private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.categoriaServicio.getCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
      });
  }

  agregar({ value, valid }: { value: Categoria, valid: boolean }) {
    if (!valid) {
      this.flashMessage.show('Por favor completar el formulario correctamente', {
        cssClass: 'alert-danger',
        timeout: 4000
      });
    } else {
        // Establecemos baja como true por defecto
    value.baja = false;
      this.categoriaServicio.agregarCategoria(value);
      this.categoriaForm.resetForm();
      this.cerrarModal();
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
  cerrarModal() {
    this.botonCerrar.nativeElement.click();
  }

  limpiar() {
    this.botonLimpiar.nativeElement.click();
  }

  resetForm() {
    this.categoriaForm.resetForm();
    this.cerrarModal();
  }
}
