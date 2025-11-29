import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Progreso } from '../../../models/Progreso';
import { Progresoservice } from '../../../services/progresoservice';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-progresocrear',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './progresocrear.html',
  styleUrls: ['./progresocrear.css']
})
export class ProgresoCrear implements OnInit {

  form!: FormGroup;
  modoEdicion: boolean = false;
  titulo: string = 'Registrar Progreso';

  estadosDisponibles: string[] = ['Activo', 'En Pausa', 'Completado', 'Pendiente'];
  
  constructor(
    private pS: Progresoservice,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idProgreso: [0],
      idUsuario: [0, Validators.required],
      puntos: [0, Validators.required],
      estado: ['', Validators.required],
      fecha: ['', Validators.required],
     
    });

    this.route.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.modoEdicion = true;
        this.titulo = 'Editar Progreso';
        const id = +idParam;
        this.pS.listId(id).subscribe({
          next: (data: Progreso) => {
            this.form.patchValue(data);
          },
          error: err => {
            console.error('Error cargando progreso:', err);
            this.snackBar.open('No se pudo cargar el progreso para editar', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/progreso']);
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

  // Objeto limpio, tal como lo espera el DTO de Java
  const progreso: Progreso = {
    idProgreso: this.form.value.idProgreso,
    idUsuario: Number(this.form.value.idUsuario), // Convertimos a número
    puntos: Number(this.form.value.puntos),       // Convertimos a número
    estado: this.form.value.estado,
    fecha: this.form.value.fecha
  };

  if (this.modoEdicion) {
    this.pS.update(progreso).subscribe({
      next: () => {
        this.pS.list().subscribe(data => this.pS.setList(data));
        this.router.navigate(['/home/progreso/listar']);
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Error al modificar', 'Cerrar', { duration: 3000 });
      }
    });
  } else {
    this.pS.insert(progreso).subscribe({
      next: () => {
        this.pS.list().subscribe(data => this.pS.setList(data));
        this.router.navigate(['/home/progreso/listar']);
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Error al registrar', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
  cancelar() { this.router.navigate(['/home']); }
}