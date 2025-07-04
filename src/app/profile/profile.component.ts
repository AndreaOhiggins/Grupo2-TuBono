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

        // set form values
        this.username.setValue(this.profileData.username);
        this.email.setValue(this.profileData.email);
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
    this.profileService.updateUser(this.userId(), this.profileData).subscribe({
      next: (response) => {
        this.showSuccessMessage = true;
        this.getProfile(); 
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 1000);
      }
      , error: (error) => {
        console.error('Error updating profile:', error);
      }
    });

  }

  onReset() {
    this.password.setValue('');
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.setErrors(null);
    });
  }

}
