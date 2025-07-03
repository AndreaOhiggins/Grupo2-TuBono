import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink, 
    FormsModule, 
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // form
  loginUserForm: FormGroup;
  email: FormControl;
  password: FormControl;

  constructor(private router: Router, private authService: AuthService) {
    // form validation
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', Validators.required);

    // form group
    this.loginUserForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  goToHome() {
    this.router.navigate(['/home/bond-table']);
  }

  login() {
    console.log('Logging in user:', this.email.value, this.password.value);

    this.authService.loginUser(this.email.value, this.password.value).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.setUserId(response.id);
        this.authService.setUserData(response);
        this.goToHome();
      }
      ,
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

  onSubmit() {
    this.loginUserForm.markAllAsTouched();

    if (this.loginUserForm.invalid) {
      console.warn('Formulario inválido. Corrige los errores antes de continuar.');
      return;
    }
    console.log('Submit login user:', this.loginUserForm.value);
    this.login();
    this.onReset();
  }

  // Reset form -> clear error messages
  onReset() {
    this.loginUserForm.reset();
    Object.keys(this.loginUserForm.controls).forEach(key => {
      const control = this.loginUserForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.setErrors(null);
    });
  }


}
