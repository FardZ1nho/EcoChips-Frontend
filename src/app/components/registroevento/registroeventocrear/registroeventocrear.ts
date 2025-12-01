import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { RegistroEvento } from '../../../models/RegistroEvento';
import { Evento } from '../../../models/Evento';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Registroeventoservice } from '../../../services/registroeventoservice';
import { AuthService } from '../../../services/authservice';
import { Eventoservice } from '../../../services/eventoservice';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-registroeventocrear',
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
  templateUrl: './registroeventocrear.html',
  styleUrls: ['./registroeventocrear.css']
})
export class RegistroEventoCrear implements OnInit {

  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;
  titulo: string = 'Registro de Evento asociado por Usuario';
  listaEventos: Evento[] = [];
  listaUsuarios: Usuario[] = [];
  usuarioLogueado!: Usuario;

  constructor(
    private reS: Registroeventoservice,
    private eS: Eventoservice,
    private uS: Usuarioservice,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Cargar lista de usuarios y eventos
    this.uS.list().subscribe(data => {
      this.listaUsuarios = data;

      // Obtener usuario logueado
      const usuarioLogueadoId = this.authService.getCurrentUserId();
      this.usuarioLogueado = this.listaUsuarios.find(u => u.idUsuario === usuarioLogueadoId)!;

      // Inicializar el formulario
      this.form = this.fb.group({
        idRegistroEvento: [''],
        idUsuario: [{ value: usuarioLogueadoId, disabled: true }, Validators.required],
        idEvento: ['', Validators.required],
        fecha: [new Date(), Validators.required]
      });

      // Si hay ID en ruta => modo edición
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id) {
          this.edicion = true;
          this.titulo = "Editar Registro";
          this.init();
        }
      });
    });

    this.eS.list().subscribe(data => this.listaEventos = data);
  }

  init() {
    this.reS.listId(this.id).subscribe(data => {
      this.form.patchValue({
        idRegistroEvento: data.idRegistroEvento,
        idUsuario: data.idUsuario,
        idEvento: data.idEvento,
        fecha: data.fechaRegistro
      });
    });
  }

  aceptar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const datosFormulario = this.form.getRawValue();
    const registro: RegistroEvento = {
      idRegistroEvento: this.edicion ? this.id : 0,
      idUsuario: datosFormulario.idUsuario,
      idEvento: datosFormulario.idEvento,
      fechaRegistro: new Date()
    };

    if (this.edicion) {
      this.reS.update(registro).subscribe({
        next: () => {
          this.reS.list().subscribe(d => this.reS.setList(d));
          this.router.navigate(['/home/registroeventos/listar']);
        },
        error: err => this.snackBar.open('Error al modificar el registro', 'Cerrar', { duration: 3000 })
      });
    } else {
      this.reS.insert(registro).subscribe({
        next: () => {
          this.reS.list().subscribe(d => this.reS.setList(d));
          this.snackBar.open('Registro creado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/home/registroeventos/listar']);
        },
        error: err => this.snackBar.open('Error al crear el registro', 'Cerrar', { duration: 3000 })
      });
    }
  }

  cancelar() {
    this.router.navigate(['/home/registroeventos/listar']);
  }
}
