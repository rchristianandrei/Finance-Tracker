import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, effect, inject, input, output, Signal, signal } from '@angular/core';
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
import { Transaction } from '@app/types/transaction';
import { TransactionTypeField } from '../input/transaction-type-field/transaction-type-field';
import { TransactionType } from '@app/types/category';

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
    TransactionTypeField,
  ],
  templateUrl: './add-transaction-form.html',
})
export class AddExpenseForm {
  private fb = inject(FormBuilder);
  protected categoryService = inject(CategoryService);

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

  typeSignal: Signal<TransactionType | null>;
  category = computed(() => {
    return this.categoryService.groupedCategories()[
      this.transaction()?.type ?? this.typeSignal() ?? 1
    ];
  });

  form = computed(() =>
    this.fb.group({
      type: new FormControl<TransactionType>(this.transaction()?.type ?? 1, Validators.required),
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

    effect(() => {
      this.category();
      this.f.category.setValue(null);
    }, {});
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
