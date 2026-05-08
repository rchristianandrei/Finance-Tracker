import { Component, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '@app/types/user';

export type DeleteUserData = {
  user: User;
};

@Component({
  selector: 'app-delete-user',
  imports: [MatDialogModule, MatButtonModule, MatError, MatProgressSpinnerModule],
  templateUrl: './delete-user.html',
})
export class DeleteUser {
  private dialogRef = inject(MatDialogRef<DeleteUser>);

  protected readonly data = inject<DeleteUserData>(MAT_DIALOG_DATA);

  readonly onDelete = output();

  readonly errorMessage = signal<string>('');
  readonly isLoading = signal(false);

  delete() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.onDelete.emit();
  }

  cancel() {
    if (this.isLoading()) return;
    this.dialogRef.close();
  }
}
