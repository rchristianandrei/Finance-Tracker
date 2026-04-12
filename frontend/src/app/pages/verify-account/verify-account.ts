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
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { finalize, interval, Subscription, take } from 'rxjs';
import { AuthService } from '@app/services/auth-service';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-verify-account',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './verify-account.html',
})
export class VerifyAccount implements OnInit {
  @ViewChildren('otpInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private countdownSub?: Subscription;

  token = signal('');
  verifyStatus = signal<{ email: string; expiresAt: Date } | null>(null);

  form = this.fb.group({
    0: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
  });

  isLoading = signal<{ initial: boolean; verifying: boolean; resending: boolean }>({
    initial: true,
    verifying: false,
    resending: false,
  });
  isVerified = signal(false);
  errorMessage = signal('');
  countdown = signal(0);
  canResend = signal(false);

  constructor() {
    effect(() => {
      if (!this.verifyStatus()) return;
      const secondsLeft = Math.ceil(
        (this.verifyStatus()!.expiresAt.getTime() - new Date().getTime()) / 1000,
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
    });
  }

  ngOnInit(): void {
    this.token.update(() => this.route.snapshot.paramMap.get('token') ?? '');
    this.authService
      .getVerifyAccountByToken(this.token())
      .pipe(finalize(() => this.isLoading.update((l) => ({ ...l, initial: false }))))
      .subscribe({
        next: (value) => {
          this.verifyStatus.set({ ...value, expiresAt: new Date(value.expiresAt) });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');

    this.form.get(String(index))?.setValue(value.slice(-1));

    if (value && index < 5) {
      this.inputs.get(index + 1)?.nativeElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.form.get(String(index))?.value && index > 0) {
      this.inputs.get(index - 1)?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const digits = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? '';

    digits.split('').forEach((digit, i) => {
      this.form.get(String(i))?.setValue(digit);
    });

    const nextEmpty = digits.length < 6 ? digits.length : 5;
    this.inputs.get(nextEmpty)?.nativeElement.focus();
  }

  focusInput(index: number): void {
    setTimeout(() => {
      this.inputs.toArray()[index]?.nativeElement.focus();
    }, 0);
  }

  verify(): void {
    if (this.form.invalid || this.isLoading().verifying || !this.verifyStatus()) return;

    const otp = Object.values(this.form.value).join('');

    this.isLoading.update((l) => ({ ...l, verifying: true }));
    this.errorMessage.set('');

    // Replace with your actual service call
    setTimeout(() => {
      this.isLoading.update((l) => ({ ...l, verifying: false }));
      if (otp === '123456') {
        this.isVerified.set(true);
      } else {
        this.errorMessage.set('Incorrect code. Please try again.');
        setTimeout(() => this.focusInput(0), 50);
      }
    }, 1500);
  }

  resendOtp(): void {
    if (!this.canResend() || this.isLoading().resending || !this.verifyStatus()) return;
    this.isLoading.update((l) => ({ ...l, resending: true }));

    this.authService
      .renewOtp(this.token())
      .pipe(
        finalize(() => {
          this.isLoading.update((l) => ({ ...l, resending: false }));
        }),
      )
      .subscribe({
        next: (value) => {
          this.verifyStatus.update((v) => {
            if (!v) return v;
            return { ...v, expiresAt: new Date(value.expiresAt) };
          });
          this.form.reset();
        },
      });
  }
}
