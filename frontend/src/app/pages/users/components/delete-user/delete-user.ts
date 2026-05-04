import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '@app/services/user-service';
import { User } from '@app/types/user';
import { resolveHttpError } from '@app/utils/http-error.util';

export type DeleteUserData = {
  user: User;
};

@Component({
  selector: 'app-delete-user',
  imports: [MatDialogModule, MatButtonModule, MatError, MatProgressSpinnerModule],
  templateUrl: './delete-user.html',
  providers: [UserService],
})
export class DeleteUser {
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<DeleteUser>);

  data = inject<DeleteUserData>(MAT_DIALOG_DATA);

  errorMessage = signal<string>('');
  isLoading = signal(false);

  delete() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.delete(this.data.user.id).subscribe({
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
