import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authservice'; 

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 🔍 Si ya está autenticado, redirigir al home
    if (this.authService.hasToken()) {
      console.log('✅ Usuario ya autenticado. Redirigiendo al home...');
      this.router.navigate(['/home']);
    }

    // 🧹 Limpiar selección previa (por si volvió atrás)
    sessionStorage.removeItem('tipoUsuarioSeleccionado');
  }

  // 🔹 MÉTODO: Seleccionar ADMIN
  seleccionarAdmin(): void {
    console.log('👨‍💼 Usuario seleccionó: ADMIN');
    
    // Guardar en sessionStorage (temporal)
    sessionStorage.setItem('tipoUsuarioSeleccionado', 'ADMIN');
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  // 🔹 MÉTODO: Seleccionar USER
  seleccionarUsuario(): void {
    console.log('👤 Usuario seleccionó: USER');
    
    // Guardar en sessionStorage (temporal)
    sessionStorage.setItem('tipoUsuarioSeleccionado', 'USER');
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  // 🔹 MÉTODO: Ir al registro
  irARegistro(): void {
    console.log('📝 Navegando al registro...');
    this.router.navigate(['/registro']);
  }
}