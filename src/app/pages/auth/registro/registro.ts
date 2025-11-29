import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Usuario } from '../../../models/Usuario';
import { AuthService } from '../../../services/authservice'; 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  usuario: Usuario = new Usuario();
  aceptaTerminos: boolean = false;
  mensajeError: string = '';
  mensajeExito: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    // 🔍 DEBUG: Ver qué datos se están enviando
    console.group('🔍 DEBUG REGISTRO');
    console.log('Nombre:', this.usuario.nombre);
    console.log('Correo:', this.usuario.correo);
    console.log('Contraseña:', this.usuario.contrasena ? '***' : '(vacía)');
    console.log('Términos aceptados:', this.aceptaTerminos);
    console.groupEnd();

    // Validaciones
    if (!this.aceptaTerminos) {
      this.mensajeError = '⚠️ Debes aceptar los términos y condiciones.';
      console.warn('❌ Validación fallida: Términos no aceptados');
      return;
    }

    if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.contrasena) {
      this.mensajeError = '⚠️ Por favor completa todos los campos.';
      console.warn('❌ Validación fallida: Campos vacíos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.correo)) {
      this.mensajeError = '⚠️ Por favor ingresa un correo válido.';
      console.warn('❌ Validación fallida: Email inválido');
      return;
    }

    if (this.usuario.contrasena.length < 6) {
      this.mensajeError = '⚠️ La contraseña debe tener al menos 6 caracteres.';
      console.warn('❌ Validación fallida: Contraseña muy corta');
      return;
    }

    if (this.usuario.nombre.length < 3) {
      this.mensajeError = '⚠️ El nombre debe tener al menos 3 caracteres.';
      console.warn('❌ Validación fallida: Nombre muy corto');
      return;
    }

    // ✅ Preparar datos (solo nombre, correo y contrasena)
    const usuarioLimpio = {
      nombre: this.usuario.nombre.trim(),
      correo: this.usuario.correo.trim().toLowerCase(),
      contrasena: this.usuario.contrasena
    };

    console.group('📤 ENVIANDO AL BACKEND');
    console.log('Endpoint:', '/register'); // ✅ Ahora es /register
    console.log('Datos:', { ...usuarioLimpio, contrasena: '***' });
    console.groupEnd();

    this.isLoading = true;

    // ✅ Llamada al backend con el endpoint correcto
    this.authService.registrar(usuarioLimpio as Usuario).subscribe({
      next: (respuesta) => {
        this.isLoading = false;
        
        console.group('✅ RESPUESTA EXITOSA');
        console.log('Respuesta del servidor:', respuesta);
        console.log('Token recibido:', respuesta.token ? 'SÍ ✅' : 'NO ❌');
        console.groupEnd();
        
        this.mensajeExito = '✅ ¡Registro exitoso! Redirigiendo al dashboard...';
        this.limpiarFormulario();
        
        // ✅ Redirigir al dashboard (ya estás auto-logueado con el token)
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        
        console.group('❌ ERROR EN REGISTRO');
        console.error('Error completo:', err);
        console.log('Status:', err.status);
        console.log('Status Text:', err.statusText);
        console.log('Error body:', err.error);
        console.log('Message:', err.message);
        console.groupEnd();
        
        // ✅ Manejo mejorado de errores
        if (err.status === 0) {
          this.mensajeError = '❌ No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        } else if (err.status === 400) {
          // El backend devuelve el error en err.error.error
          const errorMsg = err.error?.error || err.error?.message || 'Datos inválidos';
          this.mensajeError = '❌ ' + errorMsg;
        } else if (err.status === 401) {
          this.mensajeError = '❌ No autorizado. Verifica la configuración de seguridad.';
        } else if (err.status === 409) {
          this.mensajeError = '❌ Este correo o usuario ya está registrado.';
        } else if (err.status === 500) {
          const errorMsg = err.error?.error || err.error?.message || 'Error interno del servidor';
          this.mensajeError = '❌ ' + errorMsg;
        } else {
          this.mensajeError = '❌ Error al registrar. Intenta nuevamente.';
        }
      }
    });
  }

  private limpiarFormulario(): void {
    this.usuario = new Usuario();
    this.aceptaTerminos = false;
  }

  irAlLogin(): void {
    this.router.navigate(['/login']);
  }
}