import { Component } from '@angular/core';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuariocrear',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuariocrear.html',
  styleUrls: ['./usuariocrear.css']
})
export class UsuarioCrear {
  usuario: Usuario = new Usuario();
  mensaje: string = '';

  constructor(private usuarioService: Usuarioservice) {}

  registrar() {
    this.usuarioService.insert(this.usuario).subscribe({
      next: () => {
        this.mensaje = '✅ Usuario registrado correctamente';
        this.usuario = new Usuario(); // limpia el formulario
      },
      error: (err) => {
        console.error(err);
        this.mensaje = '❌ Error al registrar el usuario';
      }
    });
  }
}
