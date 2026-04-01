import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email } = this.forgotPasswordForm.value;

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);

      if (email === 'test@example.com') {
        this.successMessage.set('Password reset link sent to your email.');
      } else {
        this.errorMessage.set('Email not found.');
      }
    }, 1500);
  }
}
