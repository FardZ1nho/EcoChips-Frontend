import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/authservice'; 
import { Usuario, TipoUsuario } from '../../../models/Usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  // 🔹 Variables del formulario
  correo: string = '';
  contrasena: string = '';
  mensajeError: string = '';
  
  // 🔹 Tipo de usuario seleccionado (viene del Landing)
  tipoUsuarioSeleccionado: TipoUsuario | null = null;
  
  // 🔹 Bandera para mostrar loading
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 📌 RECUPERAR EL TIPO DE USUARIO SELECCIONADO EN EL LANDING
    const tipoTemp = sessionStorage.getItem('tipoUsuarioSeleccionado') as TipoUsuario;
    
    if (!tipoTemp) {
      // Si no hay tipo seleccionado, asumimos USER por defecto
      console.warn('⚠️ No se seleccionó tipo de usuario. Usando USER por defecto.');
      this.tipoUsuarioSeleccionado = 'USER';
      return;
    }
    
    this.tipoUsuarioSeleccionado = tipoTemp;
    console.log('✅ Tipo de usuario seleccionado:', this.tipoUsuarioSeleccionado);
  }

  // 🔐 MÉTODO DE LOGIN MEJORADO
  iniciarSesion(): void {
    // Limpiar mensajes previos
    this.mensajeError = '';

    // Validación básica
    if (!this.correo || !this.contrasena) {
      this.mensajeError = 'Por favor ingresa correo y contraseña.';
      return;
    }

    // Validar que se haya seleccionado tipo de usuario
    if (!this.tipoUsuarioSeleccionado) {
      this.tipoUsuarioSeleccionado = 'USER'; // Default
    }

    this.isLoading = true;
    console.group('🔍 INICIANDO SESIÓN');
    console.log('Correo/Usuario:', this.correo);
    console.log('Tipo seleccionado:', this.tipoUsuarioSeleccionado);
    console.groupEnd();

    // 🌐 LLAMADA AL BACKEND
    this.authService.login(this.correo, this.contrasena, this.tipoUsuarioSeleccionado).subscribe({
      next: (response: any) => {
        console.group('✅ LOGIN EXITOSO');
        console.log('Respuesta completa:', response);
        console.log('Token:', response.token ? 'SÍ ✅' : 'NO ❌');
        console.log('Roles:', response.roles);
        console.groupEnd();

        this.isLoading = false;

        // 🔍 EXTRAER ROLES (pueden venir como array de objetos o strings)
        let rolesUsuario: string[] = [];
        
        if (Array.isArray(response.roles)) {
          rolesUsuario = response.roles.map((rol: any) => {
            if (typeof rol === 'string') {
              return rol.toUpperCase();
            } else if (rol.authority) {
              return rol.authority.toUpperCase();
            }
            return '';
          }).filter(Boolean);
        }

        console.log('🔑 Roles procesados:', rolesUsuario);

        // ✅ VERIFICAR SI TIENE LOS PERMISOS ADECUADOS
        const esAdmin = rolesUsuario.some(rol => 
          rol.includes('ADMIN') || rol.includes('ROLE_ADMIN')
        );
        const esUser = rolesUsuario.some(rol => 
          rol.includes('USER') || rol.includes('ROLE_USER')
        );

        console.log('👤 Es Admin?', esAdmin);
        console.log('👤 Es User?', esUser);

        // 🚨 VALIDACIÓN: El tipo seleccionado debe coincidir con los roles
        if (this.tipoUsuarioSeleccionado === 'ADMIN' && !esAdmin) {
          console.warn('⛔ Usuario intentó acceder como ADMIN sin permisos');
          this.mensajeError = '⛔ No tienes permisos de administrador.';
          this.authService.logout();
          return;
        }

        if (this.tipoUsuarioSeleccionado === 'USER' && !esUser && !esAdmin) {
          console.warn('⛔ Usuario sin rol válido');
          this.mensajeError = '⛔ No tienes permisos válidos.';
          this.authService.logout();
          return;
        }

        // ✅ TODO OK: Redirigir según el rol
        console.log('✅ Acceso permitido. Redirigiendo...');
        
        // Limpiar sessionStorage
        sessionStorage.removeItem('tipoUsuarioSeleccionado');
        
        // ✅ REDIRIGIR A HOME
        console.log('→ Redirigiendo a /home');
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.isLoading = false;
        
        console.group('❌ ERROR EN LOGIN');
        console.error('Error completo:', err);
        console.log('Status:', err.status);
        console.log('Error body:', err.error);
        console.groupEnd();
        
        // Manejo mejorado de errores
        if (err.status === 401) {
          this.mensajeError = '❌ Correo/usuario o contraseña incorrectos.';
        } else if (err.status === 403) {
          this.mensajeError = '❌ Usuario deshabilitado. Contacta al administrador.';
        } else if (err.status === 404) {
          this.mensajeError = '❌ Usuario no encontrado.';
        } else if (err.status === 0) {
          this.mensajeError = '❌ No se pudo conectar con el servidor.';
        } else {
          const errorMsg = err.error?.error || err.error?.message || 'Error desconocido';
          this.mensajeError = '❌ ' + errorMsg;
        }
      }
    });
  }

  // 🔙 VOLVER AL LANDING
  volverAlLanding(): void {
    sessionStorage.removeItem('tipoUsuarioSeleccionado');
    this.router.navigate(['/']);
  }

  // 🔍 OBTENER EL NOMBRE DEL TIPO DE USUARIO
  getNombreTipoUsuario(): string {
    return this.tipoUsuarioSeleccionado === 'ADMIN' ? 'Administrador' : 'Usuario';
  }
}