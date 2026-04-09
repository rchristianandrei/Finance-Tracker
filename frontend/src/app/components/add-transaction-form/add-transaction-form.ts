import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, input, output, Signal, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { CategoryService } from '@app/services/category-service';
import { Transaction, TransactionType } from '@app/types/transaction';

@Component({
  selector: 'app-add-transaction-form',
  imports: [
    MatDatepickerModule,
    MatProgressSpinnerModule,
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
  private categoryService = inject(CategoryService);

  heading = input('Transaction');
  transaction = input<Transaction>();
  isLoading = input(false);
  errorMessage = input('');

  onClose = output();
  onSubmit = output<{
    type: TransactionType;
    category: string;
    amount: number;
    description: string;
    date: Date;
  }>();

  categories = ['Food', 'Transportation', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];

  typeSignal: Signal<TransactionType | null>;
  category = computed(() => {
    switch (this.transaction()?.type ?? this.typeSignal()) {
      case 'EXPENSE':
        return this.categoryService.ExpenseCategories();

      case 'INCOME':
        return this.categoryService.IncomeCategories();

      default:
        return [];
    }
  });

  form = computed(() =>
    this.fb.group({
      type: new FormControl<'EXPENSE' | 'INCOME'>(
        this.transaction()?.type ?? 'EXPENSE',
        Validators.required,
      ),
      category: [this.transaction()?.category ?? '', Validators.required],
      description: [this.transaction()?.description ?? ''],
      amount: [this.transaction()?.amount ?? null, [Validators.required, Validators.min(1)]],
      date: new FormControl<Date | null>(new Date(), Validators.required),
    }),
  );

  get f() {
    return this.form().controls;
  }

  constructor() {
    this.typeSignal = toSignal(this.form().get('type')!.valueChanges, {
      initialValue: this.form().get('type')!.value,
    });
  }

  getNow(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  close() {
    this.onClose.emit();
  }

  submit() {
    if (this.form().invalid || this.isLoading()) return;

    this.onSubmit.emit({
      type: this.f.type.value!,
      category: this.f.category.value!,
      amount: this.f.amount.value!,
      description: this.f.description.value!,
      date: this.f.date.value!,
    });
  }
}
