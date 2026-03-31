import { Component, input, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root-layout',
  imports: [
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

  constructor(private breakpointObserver: BreakpointObserver) {
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
}
