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

  accounts = this.accountsService.accounts;

  isCreateOpen = signal(false);
  updateEvent = signal<Account | null>(null);

  onEdit(account: Account) {
    this.updateEvent.set(account);
  }

  onDelete(account: Account) {
    console.log('Delete', account);
    // this.accounts.update((accs) => accs.filter((a) => a.id !== account.id));
  }
}
