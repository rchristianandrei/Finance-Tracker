import { Component, inject, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddExpenseForm } from '@app/components/add-transaction-form/add-transaction-form';
import { TransactionService } from '@app/services/transaction-service';
import { finalize } from 'rxjs';
import { ToastService } from '@app/services/toast-service';
import { resolveHttpError } from '@app/utils/http-error.util';
import { TransactionType } from '@app/types/transaction';

@Component({
  selector: 'app-add-transaction',
  imports: [MatIconModule, MatButtonModule, AddExpenseForm],
  templateUrl: './add-transaction.html',
})
export class AddTransaction {
  private transactionService = inject(TransactionService);
  private toastService = inject(ToastService);

  onAddSucess = output();

  isOpen = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  openTransactionForm = signal<TransactionType>('EXPENSE');

  toggleMenu() {
    this.isOpen.update((prev) => !prev);
  }

  setOpen(isOpen: boolean) {
    this.isOpen.set(isOpen);
  }

  onSubmit(value: {
    type: TransactionType;
    category: string;
    amount: number;
    description: string;
    date: Date;
  }) {
    this.isLoading.set(true);

    this.transactionService
      .addExpense(value)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.success('Expense successfully saved!');
          this.isOpen.set(false);
          this.onAddSucess.emit();
        },
        error: (err) => {
          this.errorMessage.set(resolveHttpError(err));
        },
      });
  }
}
