import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from './services/profile.service';
import { AuthService } from '../auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  private auth = inject(AuthService);
  userId = this.auth.userId;

  profileData: any;

  showSuccessMessage: boolean = false;

  // form
  profileForm: FormGroup;
  username: FormControl;
  email: FormControl;
  password: FormControl;
  language: FormControl;

  constructor(private profileService: ProfileService) {
    // form validation
    this.username = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', Validators.required);
    this.language = new FormControl('Español', Validators.required);

    // form group
    this.profileForm = new FormGroup({
      username: this.username,
      email: this.email,
      password: this.password,
      language: this.language
    });
  }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getUserById(this.userId()).subscribe({
      next: (response) => {
        this.profileData = response;
        this.username.setValue(this.profileData.username);
        console.log('Profile data:', this.profileData);
        this.email.setValue(this.profileData.email);
        console.log('Profile fetched successfully:', response);
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      }
    });
  }

  onSubmit() {
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      console.warn('Formulario inválido. Corrige los errores antes de continuar.');
      return;
    }
    console.log('Creating new user:', this.profileForm.value);
    this.editProfile();
    this.onReset();
  }

  editProfile() {
    this.profileData = {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      role: this.profileData.role
    }
    console.log('Updating profile with data:', this.profileData);
    this.profileService.updateUser(this.userId(), this.profileData).subscribe({
      next: (response) => {
        this.showSuccessMessage = true;
        this.getProfile(); // Refresh profile data after update
        console.log('Profile updated successfully:', response);
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 1000);
      }
      , error: (error) => {
        console.error('Error updating profile:', error);
      }
    });

  }

  // Reset form -> clear error messages
  onReset() {
    // this.profileForm.reset();
    // just reset password 
    this.password.setValue(''); // Reset password field only
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.setErrors(null);
    });
  }




  usuario: string = 'juanrodriguez';
  correo: string = 'juanrodrigues@gmail.com';
  idioma: string = 'Español';


  guardarCambios() {
    // Aquí puedes agregar lógica para guardar los cambios
    console.log('Usuario:', this.usuario);
    console.log('Correo:', this.correo);
    console.log('Idioma:', this.idioma);
    alert('Cambios guardados correctamente');
  }

}
