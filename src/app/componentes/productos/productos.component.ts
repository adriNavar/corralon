import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Producto } from 'src/app/modelos/producto.model';
import { ProductoServicio } from './../../servicios/producto.service';
import { Categoria, CategoriaServicio } from './../../servicios/categoria.service';
import { SidebarService } from '../../servicios/sidebar.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {
  isSidebarOpen: boolean = false;
  productos: Producto[];
  producto: Producto = {} as Producto; // Producto para agregar o editar
  editMode: boolean = false; // Indicador de modo edición
  categorias: Categoria[];

  guardarProducto: boolean = false;
  procesando: boolean = false;

  @ViewChild("productoForm") productoForm: NgForm;
  @ViewChild("botonCerrar") botonCerrar: ElementRef;
  @ViewChild("botonLimpiar") botonLimpiar: ElementRef;
  imagenPreview: string | ArrayBuffer;

  constructor(private productoServicio: ProductoServicio,
              private router: Router,
              private categoriaServicio: CategoriaServicio,
              private flashMessage: FlashMessagesService,
              private sidebarService: SidebarService,
              private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.productoServicio.getProductos().subscribe(productos => this.productos = productos);
    this.categoriaServicio.getCategorias().subscribe(categorias => this.categorias = categorias);
    this.guardarProducto = false;
    this.procesando = false;
  }

  onInput(event: any): void {
    const query = (event.target as HTMLInputElement).value;
    console.log(query);
    this.buscarProductos(query);
  }

  onInputChange(): void {
    // Verificamos si todos los campos obligatorios están completos
    this.guardarProducto = 
      !!this.producto.nombre && !!this.producto.marca && !!this.producto.descripcion 
      && !!this.producto.stock && !!this.producto.precio && !!this.producto.categoria;
  }

  openProductoModal(producto: Producto | null = null) {
    if (producto) {
      // Editar producto existente
      this.producto = { ...producto }; // Copia profunda del objeto
      this.editMode = true;
      this.guardarProducto = true; // Habilitar el botón al abrir en modo edición
      // Resto de la lógica para cargar datos del producto
      if (typeof producto.imagen === 'string') {
        // Si es una cadena, simplemente asigna la URL a imagenPreview
        this.imagenPreview = producto.imagen;
      } else {
        // Si es un archivo, muestra la imagen previa
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenPreview = e.target.result;
        };
        reader.readAsDataURL(producto.imagen);
      }
    } else {
      // Agregar nuevo producto
      this.producto = {} as Producto;
      this.editMode = false;
      this.guardarProducto = false; // Deshabilitar el botón al abrir en modo agregar
      // Resto de la lógica para configurar un nuevo producto
      this.imagenPreview = null; // Limpia la vista previa de la imagen
    }
  }
  
  
  
  agregarOEditarProducto(formulario: NgForm) {
    if (this.editMode) {
      this.editar(formulario);
    } else {
      this.agregar(formulario);
    }
  }
  

  editar({ value, valid }: { value: Producto, valid: boolean }) {
    if (!valid) {
      this.flashMessage.show('Por favor completar el formulario correctamente', {
        cssClass: 'alert-danger',
        timeout: 4000
      });
    } else {
      this.procesando = true; // Activa el estado de procesamiento
      this.guardarProducto = true; // Bloquear el botón
      value.id = this.producto.id;
      // Editar el producto
      this.productoServicio.modificarProducto(value);
  
      // Agregar un retraso de 1500 milisegundos
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Producto Modificado',
          text: 'El producto se ha modificado correctamente.'
        }).then(() => {
          // Reiniciar el formulario y salir del modo de edición
          if (this.productoForm) {
            this.productoForm.resetForm();
          }
          this.procesando = false; // Desactiva el estado de procesamiento
          this.editMode = false;
          this.cerrarModal();
          this.router.navigate(['/']);
          this.guardarProducto = false; // Desbloquear el botón
        });
      }, 1500);
    }
  }
  
  agregar({ value, valid }: { value: Producto, valid: boolean }) {
    if (!valid) {
      this.flashMessage.show('Por favor completar el formulario correctamente', {
        cssClass: 'alert-danger',
        timeout: 4000
      });
      this.guardarProducto = false;
    } else {
      this.procesando = true; // Activa el estado de procesamiento
      this.guardarProducto = true; // Bloquear el botón
      // Establecemos baja como true por defecto
      value.baja = false;
  
      console.log(value);
  
      const file = this.producto.imagen;
      if (file instanceof File) {
        const filePath = `images/${Date.now()}_${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
  
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              value.imagen = url;
              console.log(value);
              this.guardarProductoFinal(value);
            });
          })
        ).subscribe();
      } else {
        value.imagen = file ? this.producto.imagen : '';
        this.guardarProductoFinal(value);
      }
    }
  }
  
  guardarProductoFinal(producto: Producto) {
    this.productoServicio.agregarProducto(producto).then(() => {
      // Muestra un SweetAlert cuando se complete la acción
      Swal.fire({
        icon: 'success',
        title: 'Producto Agregado',
        text: 'El producto se ha agregado correctamente.'
      });
  
      this.productoForm.resetForm();
      this.cerrarModal();
      this.guardarProducto = false; // Desbloquear el botón
      this.procesando = false; // Desactiva el estado de procesamiento
    }).catch(error => {
      console.error('Error al agregar el producto:', error);
      // Muestra un SweetAlert de error si ocurre algún problema
      this.procesando = false; // Desactiva el estado de procesamiento
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al agregar el producto. Por favor, inténtalo de nuevo más tarde.'
      });
    });
  }
  
  

  eliminar() {
    if (confirm('¿Está seguro que desea eliminar el producto?')) {
      this.productoServicio.eliminarProducto(this.producto);
      this.router.navigate(['/']);
    }
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
