import { Component, effect, inject, output, signal, Signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User, UserStatus } from '@app/types/user';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '@app/services/auth-service';

export type UserFormData = {
  heading: string;
  user?: User;
  confirmButtonText?: string;
};

@Component({
  selector: 'app-save-user',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './save-user.html',
  styleUrl: './save-user.scss',
})
export class SaveUser {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SaveUser>);
  private authService = inject(AuthService);

  readonly data = inject<UserFormData>(MAT_DIALOG_DATA);

  readonly form = this.fb.group({
    firstName: [this.data.user?.firstName ?? '', Validators.required],
    lastName: [this.data.user?.lastName ?? '', Validators.required],
    isAdmin: [this.data.user?.isAdmin ?? false, Validators.required],
    status: new FormControl<UserStatus>(this.data.user?.status ?? 1, Validators.required),
  });

  readonly onSubmit = output<{
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    status: UserStatus;
  }>();

  readonly isLoading = signal(false);
  public readonly errorMessage = signal('');

  constructor() {
    effect(() => {
      if (this.isLoading()) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }

      if (this.data.user?.id === this.authService.user()?.id) {
        this.form.controls.status.disable({ emitEvent: false });
        this.form.controls.isAdmin.disable({ emitEvent: false });
      }
    });
  }

  submit() {
    if (this.isLoading() || this.form.invalid) return;
    this.isLoading.set(true);

    this.onSubmit.emit({
      firstName: this.form.controls.firstName.value!,
      lastName: this.form.controls.lastName.value!,
      isAdmin: this.form.controls.isAdmin.value!,
      status: this.form.controls.status.value!,
    });
  }

  close() {
    this.dialogRef.close();
  }

  stopLoading() {
    this.isLoading.set(false);
  }
}
