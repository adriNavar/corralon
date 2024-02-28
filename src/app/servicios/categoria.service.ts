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
    this.categoriasColeccion = db.collection('categorias', ref => ref.orderBy('numero', 'asc'));
  }

  getCategorias(): Observable<Categoria[]> {
    // obtener producto
    this.categorias = this.categoriasColeccion.snapshotChanges().pipe(
      map(cambios => {
        return cambios.map(accion => {
          const datos = accion.payload.doc.data() as Categoria; // payload es donde están nuestros datos
          datos.id = accion.payload.doc.id;
          return datos;
        })
      })
    );
    return this.categorias;
  }

  async agregarCategoria(categoria: Categoria) {
    const categoriaSnapshot = await this.categoriasColeccion.ref.get();
    const categorias = categoriaSnapshot.docs.map(doc => doc.data() as Categoria);

    const maxNumero = categorias.length > 0 ? Math.max(...categorias.map(cat => cat.numero)) : 0;
    categoria.numero = maxNumero + 1;

    this.categoriasColeccion.add(categoria);
  }


  getCategoria(id: string) {
    this.categoriaDoc = this.db.doc<Categoria>(`categorias/${id}`);
    this.categoria = this.categoriaDoc.snapshotChanges().pipe(
      map(accion => {
        if (accion.payload.exists === false) {
          return null;
        } else {
          const datos = accion.payload.data() as Categoria;
          datos.id = accion.payload.id;
          return datos;
        }
      })
    ); // aquí recuperamos el producto de la db
    return this.categoria;
  }

  modificarCategoria(categoria: Categoria) {
    this.categoriaDoc = this.db.doc<Categoria>(`categorias/${categoria.id}`);
    this.categoriaDoc.update(categoria);
  }

  eliminarCategoria(categoria: Categoria) {
    this.categoriaDoc = this.db.doc<Categoria>(`categorias/${categoria.id}`);
    this.categoriaDoc.delete();
  }
}
export { Categoria };

