import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Producto } from 'src/app/modelos/producto.model'; // Asegúrate de importar el modelo de producto
import { ProductoServicio } from 'src/app/servicios/producto.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {

  producto: Producto = {
    nombre: '',
    marca: '',
    descripcion: '',
    stock: 0,
    precio: 0,
    categoria: 0,
    imagen: ''
  };

  id: string;

  constructor(private productoServicio: ProductoServicio,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.productoServicio.getProducto(this.id).subscribe(producto => {
      this.producto = producto;
    });
  }

  guardar({ value, valid }: { value: Producto, valid: boolean }) {
    if (!valid) {
      this.flashMessage.show('Por favor completar el formulario correctamente', {
        cssClass: 'alert-danger',
        timeout: 4000
      });
    } else {
      value.id = this.id;
      // Editar el producto
      this.productoServicio.modificarProducto(value);
      this.router.navigate(['/']);
    }
  }

  eliminar() {
    if (confirm('¿Está seguro que desea eliminar el producto?')) {
      this.productoServicio.eliminarProducto(this.producto);
      this.router.navigate(['/']);
    }
  }
}
