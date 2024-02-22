import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Producto } from 'src/app/modelos/producto.model';
import { ProductoServicio } from './../../servicios/producto.service';
import { Categoria, CategoriaServicio } from './../../servicios/categoria.service';
import { SidebarService } from '../../servicios/sidebar.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importar AngularFireStorage
 // Importar AngularFireStorage
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
              private storage: AngularFireStorage) { } // Inyectar AngularFireStorage

  ngOnInit(): void {
    this.productoServicio.getProductos().subscribe(
      productos => {
        this.productos = productos;
      });

      this.categoriaServicio.getCategorias().subscribe(
        categorias => {
          this.categorias = categorias;
        });
  }

  onInput(event: any): void {
    const query = (event.target as HTMLInputElement).value;
    console.log(query);
    this.buscarProductos(query);
  }

  agregar({ value, valid }: { value: Producto, valid: boolean }) {
    console.log(value);
    if (!valid) {
      this.flashMessage.show('Por favor completar el formulario correctamente', {
        cssClass: 'alert-danger',
        timeout: 4000
      });
    } else {
      const file = this.producto.imagen;
      value.imagen = file;

      console.log(typeof file);
      console.log(value);
      
      // Verificar si 'file' es de tipo File
      if (file instanceof File) {
        const filePath = `images/${Date.now()}_${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
        
        // Observar cambios en el proceso de carga de la imagen
        task.snapshotChanges().pipe(
            finalize(() => {
                // Obtener la URL de descarga de la imagen
                fileRef.getDownloadURL().subscribe(url => {
                    // Asignar la URL de la imagen al producto
                    value.imagen = url;
                    // Llamar a la función para guardar el producto en la base de datos
                    this.guardarProducto(value);
                });
            })
        ).subscribe();
      } else {
          // Si 'producto.imagen' es un string (nombre de archivo), asignarlo directamente a 'value.imagen'
          value.imagen = this.producto.imagen;
          // Llamar a la función para guardar el producto en la base de datos
          this.guardarProducto(value);
      }
    } 
  }
    
      
  

  guardarProducto(producto: Producto) {
    this.productoServicio.agregarProducto(producto);
    this.productoForm.resetForm();
    this.cerrarModal();
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

  buscarProductos(query: string): void {
    this.productoServicio.search(query).subscribe(productos => {
      this.productos = productos;
      console.log(this.productos)
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
