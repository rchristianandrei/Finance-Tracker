import { Component, input, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth-service';
import { ToastService } from '../../services/toast-service';

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
  heading = input.required();

  navigations = [
    { icon: 'dashboard', feature: 'Dashboard', route: '/dashboard' },
    { icon: 'people', feature: 'Users', route: '/users' },
    { icon: 'settings', feature: 'Settings', route: '/settings' },
  ];

  isMobile = signal(false);
  isCollapsed = signal(false);

  constructor(
    private breakpointObserver: BreakpointObserver,
    protected authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {
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

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.success('Logged out');
        this.router.navigate(['/login']);
      },
    });
  }
}
