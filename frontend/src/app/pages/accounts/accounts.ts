import { Component, inject, signal } from '@angular/core';
import { RootLayout } from '@app/components/root-layout/root-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Account } from '@app/types/account';
import { DecimalPipe } from '@angular/common';
import { AccountService } from '@app/services/account-service';
import { MatButtonModule } from '@angular/material/button';
import { CreateAccount } from './components/create-account/create-account';
import { UpdateAccount } from './components/update-account/update-account';
import { DeleteAccount } from './components/delete-account/delete-account';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '@app/services/toast-service';

@Component({
  selector: 'app-accounts',
  imports: [
    RootLayout,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    DecimalPipe,
    MatButtonModule,
    CreateAccount,
    UpdateAccount,
  ],
  templateUrl: './accounts.html',
})
export class Accounts {
  private accountsService = inject(AccountService);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);

  accounts = this.accountsService.accounts;

  isCreateOpen = signal(false);
  isDeleteOpen = signal(false);
  updateEvent = signal<Account | null>(null);

  onCreate() {
    if (this.isCreateOpen()) return;
    if (this.accounts().length >= 5) {
      this.toastService.error('You already have a maximum of 5 accounts');
      return;
    }
    this.isCreateOpen.set(true);
  }

  onEdit(account: Account) {
    this.updateEvent.set(account);
  }

  onDelete(account: Account) {
    if (this.isDeleteOpen()) return;
    this.isDeleteOpen.set(true);

    const dialogRef = this.dialog.open(DeleteAccount, {
      data: {
        account,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isDeleteOpen.set(false);
    });
  }
}
