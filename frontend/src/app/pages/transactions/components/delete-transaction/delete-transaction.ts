import { Component, inject, input, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData } from '@app/components/confirm-dialog/confirm-dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '@app/services/toast-service';
import { MatCard } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { TransactionService } from '@app/services/transaction-service';
import { Transaction } from '@app/types/transaction';
import { DatePipe } from '@angular/common';
import { resolveHttpError } from '@app/utils/http-error.util';
import { finalize } from 'rxjs';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-delete-transaction',
  imports: [MatIconModule, MatCard, MatProgressSpinner, MatButtonModule, DatePipe, MatError],
  templateUrl: './delete-transaction.html',
  styleUrl: './delete-transaction.scss',
})
export class DeleteTransaction {
  private transactionService = inject(TransactionService);
  private toastService = inject(ToastService);

  transaction = input.required<Transaction>();

  onClose = output<boolean>();

  isLoading = signal(false);
  errorMessage = signal('');

  delete() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.transactionService
      .delete(this.transaction().id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.toastService.success('Transaction Deleted');
          this.onClose.emit(true);
        },
        error: (err) => {
          this.errorMessage.set(resolveHttpError(err));
          this.toastService.error('Failed to delete the transaction');
        },
      });
  }

  close() {
    if (this.isLoading()) return;
    this.onClose.emit(false);
  }
}
