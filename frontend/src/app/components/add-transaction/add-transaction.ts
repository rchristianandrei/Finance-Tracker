import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddExpense } from '../add-expense/add-expense';

type TransactionType = 'expense' | 'income' | null;

@Component({
  selector: 'app-add-transaction',
  imports: [MatIconModule, MatButtonModule, AddExpense],
  templateUrl: './add-transaction.html',
})
export class AddTransaction {
  open = signal(false);

  openTransactionForm = signal<TransactionType>(null);

  toggleMenu() {
    this.open.update((prev) => !prev);
  }

  openForm(transactionType: TransactionType) {
    this.openTransactionForm.set(transactionType);
    this.open.set(false);
  }
}
