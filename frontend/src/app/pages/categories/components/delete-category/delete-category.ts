import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryService } from '@app/services/category-service';
import { Category } from '@app/types/category';
import { resolveHttpError } from '@app/utils/http-error.util';

export type DeleteCategoryData = {
  category: Category;
};

@Component({
  selector: 'app-delete-category',
  imports: [MatDialogModule, MatError, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './delete-category.html',
})
export class DeleteCategory {
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef<DeleteCategory>);

  data = inject<DeleteCategoryData>(MAT_DIALOG_DATA);

  errorMessage = signal<string>('');
  isLoading = signal(false);

  delete() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoryService.delete(this.data.category.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMessage.set(resolveHttpError(err));
        this.isLoading.set(false);
      },
    });
  }

  cancel() {
    if (this.isLoading()) return;
    this.dialogRef.close();
  }
}
