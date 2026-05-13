import { Component, effect, inject, input, output, signal } from '@angular/core';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { CategoryService } from '@app/services/category-service';
import { Transaction } from '@app/types/transaction';
import { TransactionTypeField } from '../input/transaction-type-field/transaction-type-field';
import { Category, TransactionType } from '@app/types/category';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-transaction-form',
  imports: [
    MatAutocompleteModule,
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
export class AddTransactionForm {
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

  category = signal<Category[]>([]);
  filteredCategory = signal<Category[]>([]);

  form = this.fb.group({
    type: new FormControl<TransactionType>(this.transaction()?.type ?? 1, Validators.required),
    category: [this.transaction()?.category ?? '', Validators.required],
    description: [this.transaction()?.description ?? ''],
    amount: [this.transaction()?.amount ?? null, [Validators.required, Validators.min(1)]],
    date: new FormControl<Date | null>(new Date(), Validators.required),
  });

  get f() {
    return this.form.controls;
  }

  constructor() {
    effect(() => {
      this.category.set(this.categoryService.groupedCategories()[this.transaction()?.type ?? 1]);
    });
    effect(() => {
      this.filteredCategory.set(this.category());
    });

    effect(() => {
      const t = this.transaction();
      if (!t) return;

      this.form.patchValue(
        {
          type: t.type,
          category: t.category,
          description: t.description,
          amount: t.amount,
          date: t.date ? new Date(t.date) : new Date(),
        },
        { emitEvent: false },
      );
    });

    this.f.type.valueChanges.subscribe((value) => {
      const list = this.categoryService.groupedCategories()[value ?? 1];
      this.category.set(list);
      if (list.some((c) => c.name === this.f.category.value)) return;
      this.f.category.setValue('');
    });

    this.f.category.valueChanges
      .pipe(
        startWith(''),
        map((value) =>
          this.category().filter((o) => o.name.toLowerCase().includes(value?.toLowerCase() ?? '')),
        ),
      )
      .subscribe((value) => {
        this.filteredCategory.set(value);
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
    if (this.form.invalid || this.isLoading()) return;

    this.onSubmit.emit({
      type: this.f.type.value!,
      category: this.f.category.value!,
      amount: this.f.amount.value!,
      description: this.f.description.value!,
      date: this.f.date.value!,
    });
  }
}
