import { Component, inject, output, Signal, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransactionTypeField } from '@app/components/input/transaction-type-field/transaction-type-field';
import { Category } from '@app/types/category';
import { TransactionType } from '@app/types/transaction';

export type CategoryFormData = {
  heading: string;
  category?: Category;
  type?: TransactionType;
  errorMessage?: Signal<string>;
  confirmButtonText?: string;
};

@Component({
  selector: 'app-add-category',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    TransactionTypeField,
  ],
  templateUrl: './add-category.html',
  styleUrl: './add-category.scss',
})
export class AddCategory {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddCategory>);

  data = inject<CategoryFormData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    name: [this.data.category?.name ?? '', Validators.required],
    type: new FormControl<TransactionType>(this.data.type ?? 'EXPENSE', Validators.required),
  });

  onSubmit = output<{ type: TransactionType; name: string }>();

  isLoading = signal(false);

  submit() {
    if (this.isLoading() || this.form.invalid) return;
    this.isLoading.set(true);

    this.onSubmit.emit({
      type: this.form.controls.type.value!,
      name: this.form.controls.name.value!,
    });
  }

  close() {
    this.dialogRef.close();
  }

  stopLoading() {
    this.isLoading.set(false);
  }
}
