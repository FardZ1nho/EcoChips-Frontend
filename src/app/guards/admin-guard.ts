import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/authservice'; 

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

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

    // 2️⃣ Verificar si el tipo seleccionado es ADMIN
    const tipoUsuario = this.authService.getTipoUsuario();
    if (tipoUsuario !== 'ADMIN') {
      console.warn('⛔ Acceso denegado. Se requiere tipo ADMIN.');
      this.router.navigate(['/home']);
      return false;
    }

    // 3️⃣ Verificar si tiene el rol de ADMIN
    if (!this.authService.esAdmin()) {
      console.warn('⛔ Acceso denegado. No tiene rol de administrador.');
      this.router.navigate(['/home']);
      return false;
    }

    // ✅ Todo OK, puede acceder
    console.log('✅ Acceso admin permitido');
    return true;
  }
}