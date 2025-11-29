
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Recomendacion } from '../../../models/Recomendacion';
import { Recomendacionservice } from '../../../services/recomendacionservice';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recomendacioncrear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
      ],
  templateUrl: './recomendacioncrear.html',
  styleUrls: ['./recomendacioncrear.css']
})
export class RecomendacionCrear implements OnInit {
  form!: FormGroup;
  modoEdicion: boolean = false;
  titulo: string = 'Registrar Recomendación';

  tiposDisponibles: string[] = ['Alimentación', 'Transporte', 'Residuos', 'General'];

  constructor(
    private rS: Recomendacionservice,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      idRecomendacion: [0],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.modoEdicion = true;
        this.titulo = 'Editar Recomendación';

        this.rS.listId(id).subscribe({
          next: (data: Recomendacion) => {
            this.form.patchValue(data);
          },
          error: () => {
            this.snackBar.open('No se pudo cargar la recomendación', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/recomendaciones']);
          }
        });
      }
    });
  }

  registrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const recomendacion: Recomendacion = this.form.value;

    if (this.modoEdicion) {
      this.rS.update(recomendacion).subscribe({
        next: () => {
          this.rS.list().subscribe(data => this.rS.setList(data));
          this.snackBar.open('Recomendación modificada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/home/recomendaciones/listar']);
        },
        error: () => this.snackBar.open('Error al modificar', 'Cerrar', { duration: 3000 })
      });

    } else {
      this.rS.insert(recomendacion).subscribe({
        next: () => {
          this.rS.list().subscribe(data => this.rS.setList(data));
          this.snackBar.open('Recomendación registrada', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/home/recomendaciones/listar']);
        },
        error: () => this.snackBar.open('Error al registrar', 'Cerrar', { duration: 3000 })
      });
    }
  }
  cancelar() { this.router.navigate(['/home']); }
}