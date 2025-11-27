import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// 1. IMPORTAR EL SERVICIO Y EL MODELO
// Asegúrate de que las rutas coincidan con tu estructura
import { Usuarioservice } from '../../../services/usuarioservice'; 
import { Usuario } from '../../../models/Usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  // Variables conectadas al HTML con ngModel
  correo: string = '';
  contrasena: string = '';
  mensajeError: string = '';

  constructor(private usuarioService: Usuarioservice, private router: Router) {}

  iniciarSesion() {
    // Limpiamos mensajes anteriores
    this.mensajeError = '';

    // Validamos que haya escrito algo
    if (!this.correo || !this.contrasena) {
      this.mensajeError = 'Por favor ingresa correo y contraseña.';
      return;
    }

    console.log('Verificando credenciales con el servidor...');

    // 2. LLAMADA REAL AL BACKEND
    this.usuarioService.login(this.correo, this.contrasena).subscribe({
      next: (usuarioReal: any) => {
        // ✅ ÉXITO: El backend confirmó las credenciales
        console.log("Login exitoso:", usuarioReal);
        
        // 3. GUARDAR LA "LLAVE" PARA EL GUARD
        // Guardamos el objeto usuario completo que devolvió Java
        localStorage.setItem('usuario', JSON.stringify(usuarioReal));
        // Guardamos un token (simulado o real) para que el Guard lo vea
        localStorage.setItem('token', 'token-de-sesion-valido'); 

        // 4. REDIRIGIR AL HOME
        this.router.navigate(['/home']);
      },
      error: (err: any) => { // ✅ CORREGIDO: Añadimos ': any' para evitar el error de TypeScript
        // ⛔ ERROR: Contraseña incorrecta, usuario no encontrado o error de servidor
        console.error("Error de login:", err);
        
        if (err.status === 401) {
          this.mensajeError = 'Correo o contraseña incorrectos.';
        } else {
          this.mensajeError = 'No se pudo conectar con el servidor.';
        }
      }
    });
  }
}