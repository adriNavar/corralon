import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Producto } from 'src/app/modelos/producto.model';
import { ProductoServicio } from './../../servicios/producto.service';
import { Categoria, CategoriaServicio } from './../../servicios/categoria.service';
import { SidebarService } from '../../servicios/sidebar.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'; 
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  isSidebarOpen: boolean = false;
  productos: Producto[];
  categorias: Categoria[];
  producto: Producto = {
    nombre: '',
  };
  @ViewChild("productoForm") productoForm: NgForm;
  @ViewChild("botonCerrar") botonCerrar: ElementRef;
  @ViewChild("botonLimpiar") botonLimpiar: ElementRef;
  imagenPreview: string | ArrayBuffer;

  constructor(private productoServicio: ProductoServicio,
              private categoriaServicio: CategoriaServicio,
              private flashMessage: FlashMessagesService,
              private sidebarService: SidebarService,
              private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.productoServicio.getProductos().subscribe(productos => this.productos = productos);
    this.categoriaServicio.getCategorias().subscribe(categorias => this.categorias = categorias);
  }

  onInput(event: any): void {
    const query = (event.target as HTMLInputElement).value;
    console.log(query);
    this.buscarProductos(query);
  }

  agregar({ value, valid }: { value: Producto, valid: boolean }) {
    if (!valid) {
      this.flashMessage.show('Por favor completar el formulario correctamente', {
        cssClass: 'alert-danger',
        timeout: 4000
      });
      return;
    }

    console.log(value)

    const file = this.producto.imagen;
    if (file instanceof File) {
      const filePath = `images/${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            value.imagen = url;
            console.log(value)
            this.guardarProducto(value);
          });
        })
      ).subscribe();
    } else {
      value.imagen = file ? this.producto.imagen : '';
      this.guardarProducto(value);
    }
  }   

  guardarProducto(producto: Producto) {
    this.productoServicio.agregarProducto(producto);
    this.productoForm.resetForm();
    this.cerrarModal();
  }

  cerrarModal() {
    this.botonCerrar?.nativeElement?.click();
  }

  limpiar() {
    this.botonLimpiar?.nativeElement?.click();
  }

  resetForm() {
    this.productoForm.resetForm();
    this.cerrarModal();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  buscarProductos(query: string): void {
    this.productoServicio.search(query).subscribe(productos => {
      this.productos = productos;
    });
  }

  onFileSelected(event): void {
    const file: File = event.target.files[0];
    
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.producto.imagen = file; 
    }
  }
}
