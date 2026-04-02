import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { filter, map, take } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoading.pipe(
    filter((state) => state === false),
    take(1),
    map(() => {
      if (authService.user()) {
        router.navigate(['/']);
        return false;
      }
      return true;
    }),
  );
};
