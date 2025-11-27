import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// 1. IMPORTAMOS EL MODELO Y EL SERVICIO
// Asegúrate de que las rutas coincidan con tus carpetas
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  // 2. USAMOS EL OBJETO USUARIO (Conecta con el modelo que modificamos)
  usuario: Usuario = new Usuario();
  aceptaTerminos: boolean = false;

  // 3. INYECTAMOS EL SERVICIO EN EL CONSTRUCTOR
  constructor(private usuarioService: Usuarioservice, private router: Router) {}

  registrar() {
    // Validaciones
    if (!this.aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    // Verificamos usando el objeto this.usuario
    if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.contrasena) {
      alert('Por favor completa todos los campos.');
      return;
    }

    console.log('Registrando usuario:', this.usuario);

    // 4. LLAMADA AL SERVICIO (CONECTA CON EL BACKEND)
    // Usamos el método 'registrar' que creamos en el paso anterior
    this.usuarioService.registrar(this.usuario).subscribe({
      next: (respuesta) => {
        console.log("Éxito:", respuesta);
        alert("¡Registro exitoso! Ahora inicia sesión.");
        this.router.navigate(['/login']); // Redirige al login
      },
      error: (err) => {
        console.error("Error:", err);
        // Muestra el error que devuelve Java (ej: "Correo ya existe")
        alert("Error al registrar: " + (err.error || "Intenta nuevamente"));
      }
    });
  }
}