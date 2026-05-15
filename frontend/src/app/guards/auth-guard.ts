import { inject } from '@angular/core';
import { filter, map, take } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoading.pipe(
    filter((state) => state === false),
    take(1),
    map(() => {
      if (!authService.user()) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    }),
  );
};
