import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authservice';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenValid()) {
    return true; // Token válido, pasa
  } else {
    // No hay token, redirigir al login
    router.navigate(['/login']);
    return false;
  }
};