import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signUpForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    preferredAvatar: [''],
    iban: [
      '',
      [Validators.required, Validators.pattern(/DE\d{2}\s?(\d{4}\s?){4}\d{2}/)],
    ], // simple structure of german IBAN
  });

  avatars = [
    { value: '1', viewValue: 'Avatar 1' },
    { value: '2', viewValue: 'Avatar 2' },
    { value: '3', viewValue: 'Avatar 3' },
    { value: '4', viewValue: 'Avatar 4' },
    { value: '5', viewValue: 'Avatar 5' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit() {
    if (this.signUpForm.valid) {
      this.authService.signup(this.signUpForm.value).subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          // Show snakbar on success
          this.snackBar.open('Erfolgreich registriert!', 'Schliessen', {
            duration: 5000,
          });
          // Autonavigatoin to login page
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('There was an error during signup', error);
          // Show snakbar on error
          this.snackBar.open('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.', 'Schliessen', {
            duration: 5000,
          });
        },
      });
    }
  }
 
}
