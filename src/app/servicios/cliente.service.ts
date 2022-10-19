import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { map, Observable } from "rxjs";
import { Cliente } from "../modelos/cliente.model";


@Injectable()

export class ClienteServicio{
  clientesColeccion: AngularFirestoreCollection<Cliente>;
  clienteDoc: AngularFirestoreDocument<Cliente>;
  clientes: Observable<Cliente[]>;
  cliente: Observable<Cliente>;


  constructor(private db: AngularFirestore){
    this.clientesColeccion=db.collection('clientes',ref =>ref.orderBy('nombre','asc'))// traigo de la db de forma ascendente asc
  }


  getClientes(): Observable<Cliente[]>{
    //obtener cliente
    this.clientes=this.clientesColeccion.snapshotChanges().pipe(
      map(cambios =>{
        return cambios.map(accion => {
          const datos= accion.payload.doc.data()as Cliente; //payload es donde estan nuestros datos
          datos.id= accion.payload.doc.id;
          return datos;
        })
      })

    );
    return this.clientes;
  }

}
