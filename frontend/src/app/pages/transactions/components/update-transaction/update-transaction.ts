import { Component, inject, input, output, signal } from '@angular/core';
import { AddExpenseForm } from '@app/components/add-transaction-form/add-transaction-form';
import { ToastService } from '@app/services/toast-service';
import { TransactionService } from '@app/services/transaction-service';
import { Transaction } from '@app/types/transaction';
import { resolveHttpError } from '@app/utils/http-error.util';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-update-transaction',
  imports: [AddExpenseForm],
  templateUrl: './update-transaction.html',
  styleUrl: './update-transaction.scss',
})
export class UpdateTransaction {
  private transactionService = inject(TransactionService);
  private toastService = inject(ToastService);

  transaction = input.required<Transaction>();

  onClose = output<boolean>();

  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit(transaction: { category: string; amount: number; description: string; date: Date }) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.transactionService
      .update({
        ...this.transaction(),
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.toastService.success('Updated the Transaction');
          this.onClose.emit(true);
        },
        error: (err) => {
          this.errorMessage.set(resolveHttpError(err));
          this.toastService.error('Failed to update the transaction');
        },
      });
  }

  close() {
    if (this.isLoading()) return;
    this.onClose.emit(false);
  }
}
