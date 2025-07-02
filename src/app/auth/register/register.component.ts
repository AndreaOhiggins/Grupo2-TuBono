import { Component, NgModule } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink, 
    FormsModule, 
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  // form
  newUserForm: FormGroup;
  username: FormControl;
  email: FormControl;
  password: FormControl;
  role: FormControl;


  constructor(private router: Router, private authService: AuthService) {
    // form validation
    this.username = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', Validators.required);
    this.role = new FormControl('', Validators.required);

    // form group
    this.newUserForm = new FormGroup({
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    });

  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  newUser!: any;

  register() {

    this.newUser = {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      role: this.role.value
    }
    console.log('Registering new user:', this.newUser);

    this.authService.registerUser(this.newUser).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }


  selectRole(roleValue: string) {
    if (this.role.value === roleValue) {
      this.role.setValue('');
    } else {
      this.role.setValue(roleValue);
    }

    this.role.markAsTouched();
  }


  onSubmit() {
    this.newUserForm.markAllAsTouched();

    if (this.newUserForm.invalid) {
      console.warn('Formulario inválido. Corrige los errores antes de continuar.');
      return;
    }
    console.log('Creating new user:', this.newUserForm.value);
    this.register();
    this.onReset();
  }

  // Reset form -> clear error messages
  onReset() {
    this.newUserForm.reset();
    Object.keys(this.newUserForm.controls).forEach(key => {
      const control = this.newUserForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.setErrors(null);
    });
  }


}
