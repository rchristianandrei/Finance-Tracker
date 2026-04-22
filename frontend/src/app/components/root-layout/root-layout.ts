import { RouterModule } from '@angular/router';
import { Component, inject, input, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '@app/services/auth-service';
import { ToastService } from '@app/services/toast-service';
import { ConfirmDialog, ConfirmDialogData } from '@app/components/confirm-dialog/confirm-dialog';
import { SelectAccount } from '../select-account/select-account';
import { AccountService } from '@app/services/account-service';

@Component({
  selector: 'app-root-layout',
  imports: [
    MatMenuModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './root-layout.html',
})
export class RootLayout {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private toastService = inject(ToastService);
  private logoutDialog = inject(MatDialog);
  private accountDialog = inject(MatDialog);

  heading = input.required();

  navigations = [
    { icon: 'dashboard', feature: 'Dashboard', route: '/' },
    { icon: 'payment', feature: 'Transactions', route: '/transactions' },
    { icon: 'account_balance', feature: 'Accounts', route: '/accounts' },
    { icon: 'people', feature: 'Users', route: '/users' },
    { icon: 'settings', feature: 'Settings', route: '/settings' },
  ];

  user = this.authService.user;
  selectedAccount = this.accountService.default;
  isMobile = signal(false);
  isCollapsed = signal(false);

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile.set(result.matches);
    });
  }

  toggleSidebar() {
    this.isCollapsed.update((val) => !val);
  }

  closeIfMobile(sidenav: any) {
    if (this.isMobile()) {
      sidenav.close();
    }
  }

  selectAccount() {
    const dialogRef = this.accountDialog.open(SelectAccount);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Selected:', result);
      } else {
        console.log('Cancelled');
      }
    });
  }

  logout() {
    const data: ConfirmDialogData = {
      title: 'Logout',
      message: 'Do you want to logout?',
      theme: 'destructive',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
    };

    this.logoutDialog
      .open(ConfirmDialog, { data, width: '400px' })
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.authService.logout().subscribe({
            next: () => {
              this.toastService.success('Logged out');
            },
          });
        } else {
        }
      });
  }
}
