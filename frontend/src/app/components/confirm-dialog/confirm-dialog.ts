import { Component, Inject, signal } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  theme?: 'default' | 'destructive';
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}

  getTheme() {
    switch (this.data.theme) {
      case 'destructive':
        return 'bg-red-600';

      default:
        return 'bg-blue-600';
    }
  }
}
