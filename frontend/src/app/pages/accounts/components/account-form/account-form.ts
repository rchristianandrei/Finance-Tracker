import { Component, inject, input, output, signal, Signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Account } from '@app/types/account';

export type AccountFormData = {
  heading?: string;
  account?: Account;
  errorMessage: Signal<string>;
  confirmButtonText?: string;
};

@Component({
  selector: 'app-account-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './account-form.html',
})
export class AccountForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AccountForm>);

  data = inject<AccountFormData>(MAT_DIALOG_DATA);

  onConfirm = output<string>();

  isLoading = signal(false);

  form = this.fb.group({
    name: [this.data.account?.name || '', Validators.required],
  });

  submit() {
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.onConfirm.emit(this.form.value.name!);
  }

  cancel() {
    if (this.isLoading()) return;
    this.dialogRef.close();
  }

  doneLoading() {
    this.isLoading.set(false);
  }
}
