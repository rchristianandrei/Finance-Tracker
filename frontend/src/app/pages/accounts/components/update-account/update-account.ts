import { Component, inject, input, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '@app/services/account-service';
import { resolveHttpError } from '@app/utils/http-error.util';
import { AccountForm, AccountFormData } from '../account-form/account-form';
import { Account } from '@app/types/account';

@Component({
  selector: 'app-update-account',
  imports: [],
  templateUrl: './update-account.html',
})
export class UpdateAccount {
  private dialog = inject(MatDialog);
  private accountService = inject(AccountService);

  account = input.required<Account>();
  onClose = output();

  createErrorMessage = signal('');

  ngOnInit(): void {
    const dialogRef = this.dialog.open<AccountForm, AccountFormData>(AccountForm, {
      data: {
        heading: 'Update Account',
        account: this.account(),
        errorMessage: this.createErrorMessage.asReadonly(),
        confirmButtonText: 'Update',
      },
    });

    dialogRef.componentInstance.onCreate.subscribe((accountName: string) => {
      this.accountService.createAccount(accountName).subscribe({
        next: () => {
          dialogRef.close();
        },
        error: (err) => {
          this.createErrorMessage.set(resolveHttpError(err));
          dialogRef.componentInstance.doneLoading();
        },
      });
    });

    dialogRef.afterClosed().subscribe(() => {
      this.onClose.emit();
    });
  }
}
