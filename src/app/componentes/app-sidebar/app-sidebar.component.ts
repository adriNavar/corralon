import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { SidebarService } from 'src/app/servicios/sidebar.service';
import { CarritoService, ItemCarrito } from 'src/app/servicios/carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.css']
})

export class AppSidebarComponent implements OnInit {
  isSidebarOpen: boolean = false;

  ventaActual: ItemCarrito[] = [];
  total: number = 0;
  @Output() onModificarItem = new EventEmitter<ItemCarrito>();
  constructor(
    private sidebarService: SidebarService,
    private carritoService: CarritoService
  ) { }

  ngOnInit() {
    // Control apertura/cierre sidebar
    this.sidebarService.isSidebarOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });

    // Suscripción al carrito para actualizar la lista y total
    this.carritoService.carrito$.subscribe(items => {
      this.ventaActual = items;
      this.total = this.carritoService.getTotal();
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
modificar(item: ItemCarrito) {
  // Emitís el item a quien escuche (si lo estás usando con Output)
  this.onModificarItem.emit(item);
}
  confirmarVenta() {
    Swal.fire({
      title: '¿Estás seguro de confirmar la venta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí va la lógica real para confirmar venta
        this.limpiarCarrito();
        this.toggleSidebar();

        Swal.fire({
          icon: 'success',
          title: 'Venta confirmada',
          text: 'La venta se ha realizado correctamente.'
        });
      }
    });
  }

  cancelarVenta() {
    Swal.fire({
      title: '¿Estás seguro de cancelar la venta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para cancelar la venta
        this.limpiarCarrito();
        this.toggleSidebar();

        Swal.fire({
          icon: 'success',
          title: 'Venta cancelada',
          text: 'El carrito ha sido vaciado.'
        });
      }
    });
  }


  limpiarCarrito() {
    // Suponiendo que tenés un servicio carritoService que maneja los items
    this.carritoService.limpiarCarrito();
  }

}
