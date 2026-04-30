import { finalize } from 'rxjs';
import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '@app/services/auth-service';
import { resolveHttpError } from '@app/utils/http-error.util';
import { ToastService } from '@app/services/toast-service';

import {
  SocialAuthService,
  SocialLoginModule,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [GoogleSigninButtonModule, SocialLoginModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './login.html',
})
export class Login implements OnInit {
  private destroyRef = inject(DestroyRef);
  private socialAuthService = inject(SocialAuthService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  googleBtnWidth = signal(300);
  showGoogleBtn = signal(true);

  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    this.socialAuthService.authState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      if (!user || this.isLoading()) return;
      this.isLoading.set(true);

      this.authService
        .googleLogin({ idToken: user.idToken })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            this.toastService.success('Login successful!');
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            if (err.status === 403) {
              const { message, token } = err.error;
              this.errorMessage.set(message);
              this.router.navigate(['/verify-account', token]);
            } else {
              this.errorMessage.set(resolveHttpError(err));
            }
          },
        });
    });
  }

  ngAfterViewInit() {
    this.googleBtnWidth.set(this.googleBtn.nativeElement.clientWidth);
  }

  @HostListener('window:resize')
  onResize() {
    this.showGoogleBtn.set(false);
    this.googleBtnWidth.set(this.googleBtn.nativeElement.clientWidth);
    setTimeout(() => this.showGoogleBtn.set(true), 0);
  }
}
