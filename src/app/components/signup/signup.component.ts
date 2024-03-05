import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

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
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    preferredAvatar: [''],
    iban: ['', [Validators.required, Validators.pattern(/DE\d{2}\s?(\d{4}\s?){4}\d{2}/)]], // simple structure of german IBAN
  });
  
  avatars = [
    { value: 'avatar1', viewValue: 'Avatar 1' },
    { value: 'avatar2', viewValue: 'Avatar 2' },
    { value: 'avatar3', viewValue: 'Avatar 3' },
    { value: 'avatar4', viewValue: 'Avatar 4' },
    { value: 'avatar5', viewValue: 'Avatar 5' },
  ];

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Form Data: ', this.signUpForm.value);
    }
  }
}
