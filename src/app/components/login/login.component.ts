import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService
        .login(
          this.loginForm.value.email || '',
          this.loginForm.value.password || '',
        )
        .subscribe({
          next: (response) => {
            console.log('Login erfolgreich', response);
            this.snackBar.open('Login erfolgreich!', 'Schliessen', {
              duration: 5000,
            });
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Login fehlgeschlagen', error);
            this.snackBar.open(
              'Login fehlgeschlagen. Bitte versuchen Sie es erneut.',
              'Schliessen',
              { duration: 5000 },
            );
          },
        });
    }
  }
}
