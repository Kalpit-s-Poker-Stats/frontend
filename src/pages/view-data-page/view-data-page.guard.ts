import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

export const viewDataPageGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService._isAuthenticated$.value) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
