import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddExpenseForm } from '../add-transaction-form/add-transaction-form';

type TransactionType = 'expense' | 'income' | null;

@Component({
  selector: 'app-add-transaction',
  imports: [MatIconModule, MatButtonModule, AddExpenseForm],
  templateUrl: './add-transaction.html',
})
export class AddTransaction {
  open = signal(false);

  openTransactionForm = signal<TransactionType>(null);

  toggleMenu() {
    this.open.update((prev) => !prev);
  }

  setOpen(isOpen: boolean) {
    this.open.set(isOpen);
  }

  openForm(transactionType: TransactionType) {
    this.openTransactionForm.set(transactionType);
    this.open.set(false);
  }
}
