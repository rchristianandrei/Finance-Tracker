import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { interval, Subscription, take } from 'rxjs';
import { AuthService } from '@app/services/auth-service';

@Component({
  selector: 'app-verify-account',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
  ],
  templateUrl: './verify-account.html',
})
export class VerifyAccount implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private countdownSub?: Subscription;

  verifyStatus = signal<{ email: string; expiresAt: Date } | null>(null);
  digits = signal<string[]>(['', '', '', '', '', '']);
  isVerifying = signal(false);
  isResending = signal(false);
  isVerified = signal(false);
  hasError = signal(false);
  countdown = signal(60);
  canResend = signal(false);

  // Pass this in via @Input() or router state in real usage
  maskedEmail = 'an***@email.com';

  otp = computed(() => this.digits().join(''));
  isFilled = computed(() => this.digits().every((d) => d.length === 1));

  ngOnInit(): void {
    const value = this.route.snapshot.paramMap.get('token') ?? '';
    this.authService.getVerifyAccountByToken(value).subscribe({
      next: (value) => {
        this.verifyStatus.set({ ...value, expiresAt: new Date(value.expiresAt + 'Z') });
        this.startCountdown();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
  }

  startCountdown(): void {
    if (!this.verifyStatus) return;

    const secondsLeft = Math.ceil(
      (new Date(this.verifyStatus()!.expiresAt).getTime() - new Date().getTime()) / 1000,
    );
    this.canResend.set(false);
    this.countdown.set(secondsLeft);
    this.countdownSub?.unsubscribe();

    this.countdownSub = interval(1000)
      .pipe(take(secondsLeft))
      .subscribe({
        next: () => this.countdown.update((v) => v - 1),
        complete: () => this.canResend.set(true),
      });
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);

    this.hasError.set(false);
    const updated = [...this.digits()];
    updated[index] = value;
    this.digits.set(updated);

    if (value && index < 5) {
      this.focusInput(index + 1);
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const updated = [...this.digits()];
      if (updated[index]) {
        updated[index] = '';
        this.digits.set(updated);
      } else if (index > 0) {
        updated[index - 1] = '';
        this.digits.set(updated);
        this.focusInput(index - 1);
      }
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.focusInput(index + 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
    if (!pasted) return;

    const updated = ['', '', '', '', '', ''];
    pasted
      .slice(0, 6)
      .split('')
      .forEach((char, i) => (updated[i] = char));
    this.digits.set(updated);
    this.focusInput(Math.min(pasted.length - 1, 5));
  }

  focusInput(index: number): void {
    setTimeout(() => {
      this.otpInputs.toArray()[index]?.nativeElement.focus();
    }, 0);
  }

  verify(): void {
    if (!this.isFilled() || this.isVerifying()) return;
    this.isVerifying.set(true);
    this.hasError.set(false);

    // Replace with your actual service call
    setTimeout(() => {
      this.isVerifying.set(false);
      if (this.otp() === '123456') {
        this.isVerified.set(true);
      } else {
        this.hasError.set(true);
        this.digits.set(['', '', '', '', '', '']);
        setTimeout(() => this.focusInput(0), 50);
      }
    }, 1500);
  }

  resendOtp(): void {
    if (!this.canResend() || this.isResending()) return;
    this.isResending.set(true);
    this.hasError.set(false);
    this.digits.set(['', '', '', '', '', '']);

    // Replace with your actual service call
    setTimeout(() => {
      this.isResending.set(false);
      this.startCountdown();
      setTimeout(() => this.focusInput(0), 50);
    }, 1200);
  }
}
