import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Manteniendo tu estilo de imports
import { AuthService } from '../../services/authservice';

@Component({
  selector: 'app-completar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './completar-perfil.html',
  styleUrls: ['./completar-perfil.css']
})
export class CompletarPerfilComponent implements OnInit {
  // 🔹 Variables del formulario (siguiendo tu estilo)
  form: FormGroup;
  isLoading: boolean = false;
  mensajeError: string = '';
  mensajeExito: string = '';

  // 🔹 Opciones para el select (manteniendo consistencia)
  generos = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
    { value: 'OTRO', label: 'Otro' },
    { value: 'PREFIERO_NO_DECIR', label: 'Prefiero no decir' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      edad: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      genero: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('🔄 CompletarPerfilComponent iniciado');
  }

  // 🔹 MÉTODO PRINCIPAL - Completar Perfil
  completarPerfil(): void {
    // Limpiar mensajes previos
    this.mensajeError = '';
    this.mensajeExito = '';

    console.group('🔍 COMPLETAR PERFIL - Validación');
    console.log('Formulario válido:', this.form.valid);
    console.log('Valores:', this.form.value);
    console.groupEnd();

    // Validación básica
    if (!this.form.valid) {
      this.mensajeError = '⚠️ Por favor completa todos los campos correctamente.';
      this.marcarCamposComoTouched();
      return;
    }

    this.isLoading = true;

    // Obtener ID del usuario actual
    const usuarioId = this.authService.getCurrentUserId();
    const datos = this.form.value;

    console.group('📤 ENVIANDO AL BACKEND');
    console.log('Usuario ID:', usuarioId);
    console.log('Datos:', datos);
    console.groupEnd();

    // 🌐 LLAMADA AL BACKEND
    this.authService.completarPerfil(usuarioId, datos).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        console.group('✅ PERFIL COMPLETADO EXITOSAMENTE');
        console.log('Respuesta:', response);
        console.groupEnd();

        this.mensajeExito = '✅ ¡Perfil completado exitosamente! Redirigiendo...';
        
        // ✅ Actualizar localStorage
        this.authService.actualizarUsuarioLocal(datos);
        
        // ✅ Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (err: any) => {
        this.isLoading = false;
        
        console.group('❌ ERROR EN COMPLETAR PERFIL');
        console.error('Error completo:', err);
        console.log('Status:', err.status);
        console.log('Error body:', err.error);
        console.groupEnd();
        
        // Manejo de errores (siguiendo tu estilo)
        if (err.status === 0) {
          this.mensajeError = '❌ No se pudo conectar con el servidor.';
        } else if (err.status === 400) {
          this.mensajeError = '❌ ' + (err.error || 'Datos inválidos');
        } else if (err.status === 404) {
          this.mensajeError = '❌ Usuario no encontrado.';
        } else {
          this.mensajeError = '❌ Error al completar perfil: ' + (err.error || 'Error desconocido');
        }
      }
    });
  }

  // 🔹 CANCELAR - Volver al dashboard
  cancelar(): void {
    console.log('🔙 Cancelando - Volviendo al dashboard');
    this.router.navigate(['/home']);
  }

  // 🔹 MÉTODOS PRIVADOS (helpers)
  private marcarCamposComoTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control?.markAsTouched();
    });
  }

  // 🔹 VALIDACIONES EN TIEMPO REAL (para mostrar errores)
  get edad() { return this.form.get('edad'); }
  get genero() { return this.form.get('genero'); }

  getEdadErrorMessage(): string {
    if (this.edad?.hasError('required')) {
      return 'La edad es obligatoria';
    } else if (this.edad?.hasError('min')) {
      return 'La edad mínima es 1 año';
    } else if (this.edad?.hasError('max')) {
      return 'La edad máxima es 120 años';
    }
    return '';
  }

  getGeneroErrorMessage(): string {
    if (this.genero?.hasError('required')) {
      return 'El género es obligatorio';
    }
    return '';
  }
}