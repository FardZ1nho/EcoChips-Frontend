import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Reto } from '../../../models/Reto';
import { Retoservice } from '../../../services/retoservice';
import { AuthService } from '../../../services/authservice';
import { ParticipacionReto } from '../../../models/ParticipacionReto';
import { ParticipacionRetoService } from '../../../services/participacionretoservice';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-participacionretocrear',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './participacionretocrear.html',
  styleUrls: ['./participacionretocrear.css']
})
export class ParticipacionRetoCrear implements OnInit {

  form!: FormGroup;
  id: number = 0;
  modoEdicion: boolean = false;
  titulo: string = 'Registrar Participación';
  listaUsuarios: Usuario[] = [];
  listaRetos: Reto[] = [];
  usuarioLogueado!: Usuario;

  constructor(
    private prS: ParticipacionRetoService,
    private rS: Retoservice,
    private uS: Usuarioservice,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Cargar usuarios
    this.uS.list().subscribe(data => {
      this.listaUsuarios = data;

      // Obtener usuario logueado
      const usuarioId = this.authService.getCurrentUserId();
      this.usuarioLogueado = this.listaUsuarios.find(u => u.idUsuario === usuarioId)!;

      // Inicializar formulario
      this.form = this.fb.group({
        idParticipacion: [''],
        idUsuario: [{ value: usuarioId, disabled: true }, Validators.required],
        idReto: ['', Validators.required],
        completado: [false, Validators.required]
      });

      // Modo edición
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id) {
          this.modoEdicion = true;
          this.titulo = 'Editar Participación';
          this.init();
        }
      });
    });

    // Cargar retos
    this.rS.list().subscribe(data => this.listaRetos = data);
  }

  init() {
    this.prS.listId(this.id).subscribe(data => {
      this.form.patchValue({
        idParticipacion: data.idParticipacion,
        idUsuario: data.idUsuario,
        idReto: data.idReto,
        completado: data.completado
      });
    });
  }

  registrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const datosFormulario = this.form.getRawValue();
    const participacion: ParticipacionReto = {
      idParticipacion: this.modoEdicion ? this.id : 0,
      idUsuario: datosFormulario.idUsuario,
      idReto: datosFormulario.idReto,
      completado: datosFormulario.completado
    };

    if (this.modoEdicion) {
      this.prS.update(participacion).subscribe({
        next: () => {
          this.prS.list().subscribe(d => this.prS.setList(d));
          this.snackBar.open('Participación modificada con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/home/participacionretos/listar']);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error al modificar la participación', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.prS.insert(participacion).subscribe({
        next: () => {
          this.prS.list().subscribe(d => this.prS.setList(d));
          this.snackBar.open('Participación registrada con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/home/participacionretos/listar']);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error al registrar la participación', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/home/participacionretos/listar']);
  }
}
