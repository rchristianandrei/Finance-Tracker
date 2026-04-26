import { Component, inject, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddTransactionForm } from '@app/components/add-transaction-form/add-transaction-form';
import { TransactionService } from '@app/services/transaction-service';
import { finalize } from 'rxjs';
import { ToastService } from '@app/services/toast-service';
import { resolveHttpError } from '@app/utils/http-error.util';
import { AccountService } from '@app/services/account-service';
import { TransactionType } from '@app/types/category';

@Component({
  selector: 'app-add-transaction',
  imports: [MatIconModule, MatButtonModule, AddTransactionForm],
  templateUrl: './add-transaction.html',
})
export class AddTransaction {
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private toastService = inject(ToastService);

  onAddSucess = output();

  isOpen = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  openTransactionForm = signal<TransactionType>(1);

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

    const accountId = this.accountService.selected()?.id;
    if (!accountId) {
      this.errorMessage.set('No account selected');
      this.isLoading.set(false);
      return;
    }

    this.transactionService
      .addExpense(accountId, value)
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
