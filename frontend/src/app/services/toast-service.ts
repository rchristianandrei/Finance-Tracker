import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    this.snackBar.open(message, 'close', {
      duration: 2500,
      verticalPosition: 'top',
      panelClass: ['custom-snackbar', 'bg-green-500'],
    });
  }
}
