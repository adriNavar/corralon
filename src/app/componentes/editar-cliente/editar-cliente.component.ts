import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Cliente } from 'src/app/modelos/cliente.model';
import { ClienteServicio } from 'src/app/servicios/cliente.service';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent implements OnInit {


  cliente:Cliente={
    nombre:'' ,
    apellido: '',
    email:'' ,
    saldo:0
  }

  id:string;
  constructor(private clienteServicio: ClienteServicio,
    private flashMessage:FlashMessagesService,
    private router:Router,
    private route:ActivatedRoute) { }


  ngOnInit(): void {
    this.id=this.route.snapshot.params['id'];
    this.clienteServicio.getCliente(this.id).subscribe(cliente =>{
      this.cliente=cliente;
    })
  }

  guardar({value,valid}:{value:Cliente,valid:boolean}){
    if(!valid){
      this.flashMessage.show('Por favor completar el formulario correctamente',{
        cssClass:'alert-danger',timeout: 4000 // tiempo en el que se ve el componente
      });
    }
    else{
      value.id=this.id;
      //editar el cliente
      this.clienteServicio.modificarCliente(value)
      this.router.navigate(['/'])
    }
  }

  eliminar(){
    if(confirm('Esta seguro que desea eliminar el cliente?')){
      this.clienteServicio.eliminarCliente(this.cliente);
      this.router.navigate(['/'])
    }
  }
}
