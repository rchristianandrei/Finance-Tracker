import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransactionTypeField } from '@app/components/input/transaction-type-field/transaction-type-field';
import { CategoryService } from '@app/services/category-service';
import { ToastService } from '@app/services/toast-service';
import { TransactionType } from '@app/types/transaction';
import { finalize } from 'rxjs';

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
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  form = this.fb.group({
    name: ['', Validators.required],
    type: new FormControl<TransactionType>('EXPENSE', Validators.required),
  });

  isLoading = signal(false);

  submit() {
    if (this.isLoading() || this.form.invalid) return;
    this.isLoading.set(true);

    this.categoryService
      .Create({
        type: this.form.controls.type.value!,
        name: this.form.controls.name.value!,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.toastService.success('Created a category');
          this.dialogRef.close();
        },
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
