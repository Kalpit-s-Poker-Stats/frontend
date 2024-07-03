import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

export const sessionEntryPageGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionToken = localStorage.getItem('sessionToken');

  if(sessionToken === environment.secretKey) {
    return true;
  } else {
    router.navigate(["/"]);
    return false;
  }

};
