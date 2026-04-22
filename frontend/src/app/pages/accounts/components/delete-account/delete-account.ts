import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService } from '@app/services/account-service';
import { Account } from '@app/types/account';
import { resolveHttpError } from '@app/utils/http-error.util';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

export type DeleteAccountData = {
  account?: Account;
};

@Component({
  selector: 'app-delete-account',
  imports: [
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './delete-account.html',
})
export class DeleteAccount {
  private accountService = inject(AccountService);
  private dialogRef = inject(MatDialogRef<DeleteAccount>);

  data = inject<DeleteAccountData>(MAT_DIALOG_DATA);

  errorMessage = signal<string>('');
  isLoading = signal(false);

  delete() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.accountService.deleteAccount(this.data.account!.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMessage.set(resolveHttpError(err));
        this.isLoading.set(false);
      },
    });
  }

  cancel() {
    if (this.isLoading()) return;
    this.dialogRef.close();
  }
}
