import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  correo: string = '';
  contrasena: string = '';

  constructor(private router: Router) {}

  iniciarSesion() {
    console.log('Intentando iniciar sesión con:', this.correo, this.contrasena);
    // Aquí luego agregaremos el backend, por ahora simulamos que el login fue correcto
    this.router.navigate(['/home']);
  }
}
