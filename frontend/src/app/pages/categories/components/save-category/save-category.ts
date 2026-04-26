import { Component, inject, output, Signal, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransactionTypeField } from '@app/components/input/transaction-type-field/transaction-type-field';
import { Category, TransactionType } from '@app/types/category';

export type CategoryFormData = {
  heading: string;
  category?: Category;
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
  templateUrl: './save-category.html',
})
export class SaveCategory {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SaveCategory>);

  data = inject<CategoryFormData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    name: [this.data.category?.name ?? '', Validators.required],
    type: new FormControl<TransactionType>(this.data.category?.type ?? 1, Validators.required),
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
