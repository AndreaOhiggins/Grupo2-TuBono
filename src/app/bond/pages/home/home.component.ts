import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet, 
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  private auth = inject(AuthService);
  userId = this.auth.userId;

  constructor() {
    console.log('User ID from HomeComponent:', this.userId());
  }

}
