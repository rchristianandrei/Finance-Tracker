import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressBarModule,
    RouterLink,
  ],
  templateUrl: './register.html',
})
export class Register {
  registerForm: FormGroup;

  get f() {
    return this.registerForm.controls;
  }

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const passwordControl = form.get('password');
    const confirmPasswordControl = form.get('confirmPassword');
    if (!passwordControl || !confirmPasswordControl) return null;
    if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
      return null;
    }
    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
  }
}
