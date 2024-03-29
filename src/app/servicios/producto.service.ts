import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { map, Observable } from "rxjs";
import { Producto } from "../modelos/producto.model";

@Injectable()
export class ProductoServicio {
  productosColeccion: AngularFirestoreCollection<Producto>;
  productoDoc: AngularFirestoreDocument<Producto>;
  productos: Observable<Producto[]>;
  producto: Observable<Producto>;

  constructor(private db: AngularFirestore) {
    this.productosColeccion = db.collection('productos', ref => ref.orderBy('numero', 'asc')); // traigo de la db de forma ascendente asc
  }

  getProductos(): Observable<Producto[]> {
    // obtener producto
    this.productos = this.productosColeccion.snapshotChanges().pipe(
      map(cambios => {
        return cambios.map(accion => {
          const datos = accion.payload.doc.data() as Producto; // payload es donde están nuestros datos
          datos.id = accion.payload.doc.id;
          return datos;
        })
      }),
      map(productos=>{
        //Filtro para los productos dados de baja
        return productos.filter(producto =>!producto.baja);

        })

    );
    return this.productos;
  }

  search(query: string): Observable<Producto[]> {
    // Realizar la consulta para obtener todos los productos
    return this.db.collection('productos').snapshotChanges().pipe(
      map(cambios => {
        // Mapear los datos y asignar los IDs
        return cambios.map(accion => {
          const datos = accion.payload.doc.data() as Producto;
          datos.id = accion.payload.doc.id;
          return datos;
        });
      }),
      map(productos => {
        // Filtrar los productos que coinciden con el término de búsqueda, sin distinguir entre mayúsculas y minúsculas
        return productos.filter(producto =>
          producto.nombre.toLowerCase().includes(query.toLowerCase())
        );
      })
    );
}


  async agregarProducto(producto: Producto) {
    const productoSnapshot= await this.productosColeccion.ref.get();
    const productos= productoSnapshot.docs.map(doc => doc.data() as Producto);

    const maxNumero = productos.length > 0 ? Math.max(...productos.map(prod =>prod.numero)): 0;
    producto.numero = maxNumero +1;
    this.productosColeccion.add(producto);
  }

  getProducto(id: string) {
    this.productoDoc = this.db.doc<Producto>(`productos/${id}`);
    this.producto = this.productoDoc.snapshotChanges().pipe(
      map(accion => {
        if (accion.payload.exists === false) {
          return null;
        } else {
          const datos = accion.payload.data() as Producto;
          datos.id = accion.payload.id;
          return datos;
        }
      })
    ); // aquí recuperamos el producto de la db
    return this.producto;
  }

  modificarProducto(producto: Producto) {
    this.productoDoc = this.db.doc<Producto>(`productos/${producto.id}`);
    this.productoDoc.update(producto);
  }

  eliminarProducto(producto: Producto) {
    this.productoDoc = this.db.doc<Producto>(`productos/${producto.id}`);
    // Actualizar el campo 'baja' a true en lugar de eliminar el documento
    this.productoDoc.update({ baja: true });
  }

}
