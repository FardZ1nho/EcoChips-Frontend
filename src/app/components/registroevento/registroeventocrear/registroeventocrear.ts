import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegistroEvento } from '../../../models/RegistroEvento';
import { Registroeventoservice } from '../../../services/registroeventoservice';

@Component({
  selector: 'app-registroeventocrear',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './registroeventocrear.html',
  styleUrls: ['./registroeventocrear.css']
})
export class RegistroEventoCrear implements OnInit {

  form!: FormGroup;
  modoEdicion: boolean = false;
  titulo: string = 'Registro de Evento asociado por Usuario';
  constructor(
    private reS: Registroeventoservice,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idRegistroEvento: [0],
      idUsuario: ['', Validators.required],
      idEvento: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.modoEdicion = true;
        this.titulo = 'Editar Registro';
        const id = +idParam;
        this.reS.listId(id).subscribe({
          next: data => this.form.patchValue(data),
          error: err => {
            console.error(err);
            this.snackBar.open('No se pudo cargar el registro', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/registroeventos']);
          }
        });
      }
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const registro: RegistroEvento = {
      idRegistroEvento: this.form.value.idRegistroEvento,
      idUsuario: Number(this.form.value.idUsuario),
      idEvento: Number(this.form.value.idEvento),
      fechaRegistro: new Date() // Fecha asignada automáticamente
    };

    if (this.modoEdicion) {
      this.reS.update(registro).subscribe({
        next: () => {
          this.reS.list().subscribe(data => this.reS.setList(data));
          this.router.navigate(['/home/registroeventos/listar']);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error al modificar el registro', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.reS.insert(registro).subscribe({
        next: () => {
          this.reS.list().subscribe(data => this.reS.setList(data));
          this.router.navigate(['/home/registroeventos/listar']);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error al crear el registro', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
  cancelar() { this.router.navigate(['/home']); }
}