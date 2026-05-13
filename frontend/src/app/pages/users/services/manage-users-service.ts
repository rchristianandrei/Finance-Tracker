import { inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '@app/services/user-service';
import { User } from '@app/types/user';
import { DeleteUser } from '../components/delete-user/delete-user';
import { SaveUser } from '../components/save-user/save-user';
import { finalize } from 'rxjs';
import { resolveHttpError } from '@app/utils/http-error.util';

@Injectable()
export class ManageUsersService {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  private isDialogOpen = signal(false);

  public readonly totalUsers = signal(0);
  public readonly users = signal<User[]>([]);

  constructor() {}

  loadUsers(filter: {
    search: string | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
    page: number;
  }) {
    this.userService.getUsers(filter).subscribe({
      next: (value) => {
        this.users.set(value.data);
        this.totalUsers.set(value.totalCount);
      },
    });
  }

  update(user: User) {
    if (this.isDialogOpen()) return;
    this.isDialogOpen.set(true);

    const dialogRef = this.dialog.open(SaveUser, {
      data: {
        user,
      },
    });

    dialogRef.componentInstance.onSubmit.subscribe((value) => {
      dialogRef.disableClose = true;

      this.userService
        .update({
          id: user.id,
          firstName: value.firstName,
          lastName: value.lastName,
          isAdmin: value.isAdmin,
          status: value.status,
        })
        .pipe(
          finalize(() => {
            dialogRef.disableClose = false;
            dialogRef.componentInstance.isLoading.set(false);
          }),
        )
        .subscribe({
          next: (response) => {
            dialogRef.close();
            this.users.update((users) => users.map((u) => (u.id === response.id ? response : u)));
          },
          error: (err) => {
            dialogRef.componentInstance.errorMessage.set(resolveHttpError(err));
          },
        });
    });

    dialogRef.afterClosed().subscribe((success) => {
      this.isDialogOpen.set(false);
    });
  }

  delete(user: User) {
    if (this.isDialogOpen()) return;
    this.isDialogOpen.set(true);

    const dialogRef = this.dialog.open(DeleteUser, {
      data: {
        user,
      },
    });

    dialogRef.componentInstance.onDelete.subscribe(() => {
      dialogRef.disableClose = true;

      this.userService
        .delete(user.id)
        .pipe(
          finalize(() => {
            dialogRef.disableClose = false;
            dialogRef.componentInstance.isLoading.set(false);
          }),
        )
        .subscribe({
          next: () => {
            dialogRef.close(true);
            this.users.update((users) => users.filter((u) => u.id !== user.id));
          },
          error: (err) => {
            dialogRef.componentInstance.errorMessage.set(resolveHttpError(err));
            dialogRef.componentInstance.isLoading.set(false);
          },
        });
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen.set(false);
    });
  }
}
