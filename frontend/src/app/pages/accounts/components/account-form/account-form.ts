import { Component, inject, input, output, signal, Signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService } from '@app/services/account-service';
import { AuthService } from '@app/services/auth-service';
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
    MatCheckboxModule,
  ],
  templateUrl: './account-form.html',
})
export class AccountForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AccountForm>);
  private accountService = inject(AccountService);

  data = inject<AccountFormData>(MAT_DIALOG_DATA);

  onConfirm = output<{ name: string; isDefault: boolean }>();

  isLoading = signal(false);

  form = this.fb.group({
    name: [this.data.account?.name || '', Validators.required],
    isDefault: [
      {
        value: this.data.account?.id === this.accountService.current()?.id,
        disabled: this.data.account?.id === this.accountService.current()?.id,
      },
    ],
  });

  submit() {
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.onConfirm.emit({ name: this.form.value.name!, isDefault: this.form.value.isDefault! });
  }

  cancel() {
    if (this.isLoading()) return;
    this.dialogRef.close();
  }

  doneLoading() {
    this.isLoading.set(false);
  }
}
