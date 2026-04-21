import { Component, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountService } from '@app/services/account-service';
import { Account } from '@app/types/account';

export type DeleteAccountData = {
  account?: Account;
};

@Component({
  selector: 'app-delete-account',
  imports: [MatDialogModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './delete-account.html',
})
export class DeleteAccount {
  private accountService = inject(AccountService);
  private dialogRef = inject(MatDialogRef<DeleteAccount>);

  data = inject<DeleteAccountData>(MAT_DIALOG_DATA);

  isLoading = signal(false);

  delete() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    console.log('Deleting account with id:', this.data.account?.id);
  }

  cancel() {
    if (this.isLoading()) return;
    this.dialogRef.close();
  }
}
