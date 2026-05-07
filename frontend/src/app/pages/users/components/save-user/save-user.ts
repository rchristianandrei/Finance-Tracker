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

export type UserFormData = {
  heading: string;
  user?: User;
  errorMessage?: Signal<string>;
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

  readonly data = inject<UserFormData>(MAT_DIALOG_DATA);

  readonly form = this.fb.group({
    firstName: [this.data.user?.firstName ?? '', Validators.required],
    lastName: [this.data.user?.lastName ?? '', Validators.required],
    isAdmin: [false, Validators.required],
    status: new FormControl<UserStatus>(1, Validators.required),
  });

  readonly onSubmit = output<{}>();

  readonly isLoading = signal(false);

  constructor() {
    effect(() => {
      if (this.isLoading()) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    });
  }

  submit() {
    if (this.isLoading() || this.form.invalid) return;
    this.isLoading.set(true);

    this.onSubmit.emit({});
  }

  close() {
    this.dialogRef.close();
  }

  stopLoading() {
    this.isLoading.set(false);
  }
}
