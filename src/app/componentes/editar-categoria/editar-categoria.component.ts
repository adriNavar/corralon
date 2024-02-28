import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Categoria } from 'src/app/modelos/categoria.model'; // Asegúrate de importar el modelo de categoría
import { CategoriaServicio } from 'src/app/servicios/categoria.service';

@Component({
  selector: 'app-editar-categoria',
  templateUrl: './editar-categoria.component.html',
  styleUrls: ['./editar-categoria.component.css']
})
export class EditarCategoriaComponent implements OnInit {

  categoria: Categoria;
  id: string;

  constructor(private categoriaServicio: CategoriaServicio,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.categoriaServicio.getCategoria(this.id.toString()).subscribe(categoria => {
      this.categoria = categoria;
    });
  }

  guardar({ value, valid }: { value: Categoria, valid: boolean }) {
    if (!valid) {
      this.flashMessage.show('Por favor completar el formulario correctamente', {
        cssClass: 'alert-danger',
        timeout: 4000
      });
    } else {
      value.id = this.id;
      this.categoriaServicio.modificarCategoria(value);
      this.router.navigate(['/categorias']); // Cambia la ruta a donde quieras redirigir después de guardar.
    }
  }

  eliminar() {
    if (confirm('¿Está seguro que desea eliminar la categoría?')) {
      this.categoriaServicio.eliminarCategoria(this.categoria);
      this.router.navigate(['/categorias']); // Cambia la ruta a donde quieras redirigir después de eliminar.
    }
  }
}
