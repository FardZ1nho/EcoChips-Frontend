import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authservice';

@Component({
  selector: 'app-completar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './completar-perfil.html',
  styleUrls: ['./completar-perfil.css']
})
export class CompletarPerfilComponent implements OnInit {
  form: FormGroup;
  isLoading: boolean = false;
  mensajeError: string = '';
  mensajeExito: string = '';

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

  completarPerfil(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = '⚠️ Por favor completa todos los campos correctamente.';
      return;
    }

    // 1. Iniciamos carga y bloqueamos el formulario
    this.isLoading = true;
    this.form.disable(); // <--- ESTO reemplaza al [disabled] del HTML

    const usuarioId = this.authService.getCurrentUserId();
    
    // 2. Usamos getRawValue() porque form.value ignora campos deshabilitados
    const datos = this.form.getRawValue(); 

    console.group('📤 ENVIANDO AL BACKEND');
    console.log('Usuario ID:', usuarioId);
    console.log('Datos:', datos);
    console.groupEnd();

    this.authService.completarPerfil(usuarioId, datos).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        // No habilitamos el form aquí porque ya nos vamos
        
        this.mensajeExito = '✅ ¡Perfil completado exitosamente! Redirigiendo...';
        
        this.authService.actualizarUsuarioLocal(datos);
        
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (err: any) => {
        // 3. Si falla, desbloqueamos el formulario para que intente de nuevo
        this.isLoading = false;
        this.form.enable();

        console.error('Error completo:', err);
        
        // Manejo de errores específico
        if (err.status === 0) {
          this.mensajeError = '❌ No se pudo conectar con el servidor.';
        } else if (err.status === 401) {
          this.mensajeError = '❌ Sesión expirada. Por favor inicia sesión nuevamente.';
        } else if (err.status === 404) {
          this.mensajeError = '❌ Usuario no encontrado.';
        } else {
          this.mensajeError = '❌ Error al completar perfil. Intenta nuevamente.';
        }
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }

  // Getters para el HTML (Validaciones visuales)
  get edad() { return this.form.get('edad'); }
  get genero() { return this.form.get('genero'); }

  getEdadErrorMessage(): string {
    if (this.edad?.hasError('required')) return 'La edad es obligatoria';
    if (this.edad?.hasError('min')) return 'La edad mínima es 1 año';
    if (this.edad?.hasError('max')) return 'La edad máxima es 120 años';
    return '';
  }

  getGeneroErrorMessage(): string {
    if (this.genero?.hasError('required')) return 'El género es obligatorio';
    return '';
  }
}