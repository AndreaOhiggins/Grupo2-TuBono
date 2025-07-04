import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet, 
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private authService = inject(AuthService);
  userId = computed(() => this.authService.userId());
  userData = this.authService.getUserData();
  
  constructor(private router: Router) {
    
  }

  ngOnInit(): void {
    this.authService.restoreSession();
    console.log('User ID restored in HomeComponent:', this.userId());
    // Redirección según el rol
    const role = this.userData?.role;
    if (role === 'INVESTOR') {
      this.router.navigate(['home/bond-purchases']);
    } else if (role === 'ISSUER') {
      this.router.navigate(['home/bond-table']);
    }
  }

}
