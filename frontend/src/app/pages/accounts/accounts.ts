import { Component, inject } from '@angular/core';
import { RootLayout } from '@app/components/root-layout/root-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Account } from '@app/types/account';
import { DecimalPipe } from '@angular/common';
import { AccountService } from '@app/services/account-service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-accounts',
  imports: [RootLayout, MatCardModule, MatIconModule, MatMenuModule, DecimalPipe, MatButtonModule],
  templateUrl: './accounts.html',
})
export class Accounts {
  private accountsService = inject(AccountService);

  accounts = this.accountsService.accounts;

  onCreate() {
    console.log('Create account');
    // open dialog or navigate
  }

  onEdit(account: Account) {
    console.log('Edit', account);
    // open edit dialog
  }

  onDelete(account: Account) {
    console.log('Delete', account);
    // this.accounts.update((accs) => accs.filter((a) => a.id !== account.id));
  }
}
