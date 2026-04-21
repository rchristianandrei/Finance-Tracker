import { Component, inject, OnInit, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountForm, AccountFormData } from '../account-form/account-form';
import { AccountService } from '@app/services/account-service';
import { resolveHttpError } from '@app/utils/http-error.util';

@Component({
  selector: 'app-create-account',
  imports: [],
  templateUrl: './create-account.html',
})
export class CreateAccount implements OnInit {
  private dialog = inject(MatDialog);
  private accountService = inject(AccountService);

  onClose = output();

  createErrorMessage = signal('');

  ngOnInit(): void {
    const dialogRef = this.dialog.open<AccountForm, AccountFormData>(AccountForm, {
      data: {
        heading: 'Create Account',
        errorMessage: this.createErrorMessage.asReadonly(),
        confirmButtonText: 'Create',
      },
    });

    dialogRef.componentInstance.onConfirm.subscribe((account) => {
      this.accountService.createAccount(account.name).subscribe({
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
