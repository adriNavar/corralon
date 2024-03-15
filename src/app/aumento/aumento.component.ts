import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aumento',
  templateUrl: './aumento.component.html',
  styleUrls: ['./aumento.component.css']
})
export class AumentoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onInputChange(): void {
    console.log('INPUT CHANGE')
  }

  // Método para abrir el modal de actualización de precios
  abrirModal() {
    // Aquí puedes escribir la lógica necesaria para abrir el modal
    // Por ejemplo, si estás usando Bootstrap, puedes usar jQuery o JavaScript nativo para activar el modal
    // Si estás utilizando algún otro framework o librería de UI, el enfoque puede variar
    // Por favor, asegúrate de ajustar este código según cómo hayas implementado tu modal
    // Un ejemplo genérico sería:
    const modal = document.getElementById('actualizarPreciosModal');
    if (modal) {
      modal.classList.add('show'); // Muestra el modal
      modal.style.display = 'block'; // Asegura que el modal esté visible
      // También puedes necesitar activar otros eventos o configuraciones relacionadas con el modal aquí
    }
  }

  actualizarPrecios({ value, valid }: { value: {}, valid: boolean }) {
    console.log('ACTUALIZA PRECIOS');
  }

}
