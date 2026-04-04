import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { TransactionService } from '../../services/transaction-service';
import { ToastService } from '../../services/toast-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-transaction-form',
  imports: [
    MatRadioModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-transaction-form.html',
  styleUrl: './add-transaction-form.css',
})
export class AddExpenseForm {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private toastService = inject(ToastService);

  closed = output();

  isLoading = signal(false);

  categories = ['Food', 'Transportation', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];
  form = this.fb.group({
    type: new FormControl<'Expense' | 'Income'>('Expense', Validators.required),
    category: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(1)]],
    description: [''],
    date: [this.getNow(), Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  getNow(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  close() {
    this.closed.emit();
  }

  submit() {
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);

    this.transactionService
      .addExpense({
        type: this.f.type.value!,
        category: this.f.category.value!,
        amount: this.f.amount.value!,
        description: this.f.description.value!,
        date: new Date(this.f.date.value!).toISOString(),
      })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.success('Expense successfully saved!');
          this.close();
        },
      });
  }
}
