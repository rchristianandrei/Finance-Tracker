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
        errorMessage: this.createErrorMessage.asReadonly(),
      },
    });

    dialogRef.componentInstance.onCreate.subscribe((accountName: string) => {
      this.accountService.createAccount(accountName).subscribe({
        next: () => {
          dialogRef.close();
        },
        error: (err) => {
          this.createErrorMessage.set(resolveHttpError(err));
        },
      });
    });

    dialogRef.afterClosed().subscribe(() => {
      this.onClose.emit();
    });
  }
}
