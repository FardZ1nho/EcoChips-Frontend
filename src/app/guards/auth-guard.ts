import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // 1. Buscamos si existe la "llave" en el navegador
    const tieneToken = localStorage.getItem('token');
    const tieneUsuario = localStorage.getItem('usuario');

    if (tieneToken || tieneUsuario) {
      // ✅ TIENE LLAVE: Lo dejamos pasar
      return true;
    } else {
      // ⛔ NO TIENE LLAVE: 
      // Aquí está el truco para evitar la pantalla blanca:
      // Le decimos explícitamente "Vete al Login"
      this.router.navigate(['/login']); 
      
      // Y devolvemos false para que Angular sepa que no debe cargar el Home
      return false;
    }
  }
}