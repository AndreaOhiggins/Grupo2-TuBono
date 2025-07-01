import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-profile',
  imports: [
        HeaderComponent,
        FormsModule 
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  usuario: string = 'juanrodriguez';
  correo: string='juanrodrigues@gmail.com';
  idioma: string='Español';

  
  guardarCambios() {
    // Aquí puedes agregar lógica para guardar los cambios
    console.log('Usuario:', this.usuario);
    console.log('Correo:', this.correo);
    console.log('Idioma:', this.idioma);
    alert('Cambios guardados correctamente');
  }

}
