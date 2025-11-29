import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/authservice'; 

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    
    // 1️⃣ Verificar si está autenticado
    if (!this.authService.hasToken()) {
      console.warn('⛔ No autenticado. Redirigiendo al login...');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }

    // 2️⃣ Verificar si el tipo seleccionado es USER
    const tipoUsuario = this.authService.getTipoUsuario();
    if (tipoUsuario !== 'USER') {
      console.warn('⛔ Acceso denegado. Se requiere tipo USER.');
      this.router.navigate(['/home']);
      return false;
    }

    // 3️⃣ Verificar si tiene el rol de USER
    if (!this.authService.esUsuario()) {
      console.warn('⛔ Acceso denegado. No tiene rol de usuario.');
      this.router.navigate(['/home']);
      return false;
    }

    // ✅ Todo OK, puede acceder
    console.log('✅ Acceso usuario permitido');
    return true;
  }
}