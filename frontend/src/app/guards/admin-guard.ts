import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/services/auth-service';
import { filter, map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.getMe();

  return authService.isLoading.pipe(
    filter((state) => state === false),
    take(1),
    map(() => {
      if (!authService.user()) {
        router.navigate(['/login']);
        return false;
      } else if (!authService.user()?.isAdmin) {
        router.navigate(['/']);
        return false;
      }
      return true;
    }),
  );
};
