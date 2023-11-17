import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { map, Observable } from "rxjs";
import { Categoria } from "../modelos/categoria.model";

@Injectable()
export class CategoriaServicio {
  categoriasColeccion: AngularFirestoreCollection<Categoria>;
  categoriaDoc: AngularFirestoreDocument<Categoria>;
  categorias: Observable<Categoria[]>;
  categoria: Observable<Categoria>;

  constructor(private db: AngularFirestore) {
    this.categoriasColeccion = db.collection('categorias', ref => ref.orderBy('nombre', 'asc'));
  }

  getCategorias(): Observable<Categoria[]> {
    this.categorias = this.categoriasColeccion.snapshotChanges().pipe(
      map(cambios => {
        return cambios.map(accion => {
          const datos = accion.payload.doc.data() as Categoria;
          datos.id_categoria = Number(accion.payload.doc.id);
          return datos;
        });
      })
    );
    return this.categorias;
  }

  agregarCategoria(categoria: Categoria) {
    this.categoriasColeccion.add(categoria);
  }

  getCategoria(id_categoria: string) {
    this.categoriaDoc = this.db.doc<Categoria>(`categorias/${id_categoria}`);
    this.categoria = this.categoriaDoc.snapshotChanges().pipe(
      map(accion => {
        if (accion.payload.exists === false) {
          return null;
        } else {
          const datos = accion.payload.data() as Categoria;
          datos.id_categoria = Number(accion.payload.id);

          return datos;
        }
      })
    ); // Agrega un paréntesis de cierre aquí
    return this.categoria;
  }


  modificarCategoria(categoria: Categoria) {
    this.categoriaDoc = this.db.doc<Categoria>(`categorias/${categoria.id_categoria}`);
    this.categoriaDoc.update(categoria);
  }

  eliminarCategoria(categoria: Categoria) {
    this.categoriaDoc = this.db.doc<Categoria>(`categorias/${categoria.id_categoria}`);
    this.categoriaDoc.delete();
  }
}
export { Categoria };

