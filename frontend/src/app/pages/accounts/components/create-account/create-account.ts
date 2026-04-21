import { Component, inject, OnInit, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountForm, AccountFormData } from '../account-form/account-form';

@Component({
  selector: 'app-create-account',
  imports: [],
  templateUrl: './create-account.html',
})
export class CreateAccount implements OnInit {
  private dialog = inject(MatDialog);

  onClose = output();

  createErrorMessage = signal('');

  ngOnInit(): void {
    const dialogRef = this.dialog.open<AccountForm, AccountFormData>(AccountForm, {
      data: {
        errorMessage: this.createErrorMessage.asReadonly(),
      },
    });

    dialogRef.componentInstance.onCreate.subscribe((accountName: string) => {
      console.log('Creating account:', accountName);
      this.createErrorMessage.set('Something went wrong while creating the account.');
      setTimeout(() => {
        dialogRef.close();
        this.onClose.emit();
      }, 1000);
    });
  }
}
