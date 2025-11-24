import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';
  aceptaTerminos: boolean = false;

  constructor(private router: Router) {}

  registrar() {
    if (!this.aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    console.log('Registrando usuario:', this.nombre, this.correo, this.contrasena);
    // Aquí luego conectaremos al backend (usuarioService)
    this.router.navigate(['/home']);
  }
}
