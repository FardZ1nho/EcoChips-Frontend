import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Reto } from '../../../models/Reto';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { Retoservice } from '../../../services/retoservice';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-retocrear',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './retocrear.html',
  styleUrls: ['./retocrear.css']
})
export class Retocrear implements OnInit {
  form: FormGroup = new FormGroup({});
  modoEdicion: boolean = false;
  id: number = 0;
  titulo: string = 'Registrar Reto';
  minDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private rS: Retoservice,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idReto: [''],
      titulo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      objetivoKg: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });

    // Revisamos si es modo edición
    this.route.params.subscribe(params => {
      const idParam = params['id'];
      if(idParam){
        this.modoEdicion = true;
        this.titulo = 'Editar Reto';
        const id = +idParam;
        this.rS.listId(id).subscribe({
          next: (data: Reto) => {
            // Inicializamos el form con los datos existentes
            this.initForm(data);
          },
          error: err => {
            console.error('Error cargando reto:', err);
            this.snackBar.open('No se pudo cargar el reto para editar', 'Cerrar', {duration: 3000});
            this.router.navigate(['/retos']);
          }
        });
      }
    });
  }

  // Función para inicializar el form en modo edición
  initForm(data: Reto) {
    this.form = new FormGroup({
      idReto: new FormControl(data.idReto),
      titulo: new FormControl(data.titulo, Validators.required),
      descripcion: new FormControl(data.descripcion, [Validators.required, Validators.maxLength(1000)]),
      objetivoKg: new FormControl(data.objetivoKg, Validators.required),
      fechaInicio: new FormControl(data.fechaInicio, Validators.required),
      fechaFin: new FormControl(data.fechaFin, Validators.required)
    });
  }

  registrar() {
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    // Crear objeto tipado Reto
    const reto: Reto = {
      idReto: this.modoEdicion ? this.form.value.idReto : 0, // <-- aquí usamos idReto correctamente
      titulo: this.form.value.titulo,
      descripcion: this.form.value.descripcion,
      objetivoKg: this.form.value.objetivoKg,
      fechaInicio: this.form.value.fechaInicio,
      fechaFin: this.form.value.fechaFin,
    };

    // Validaciones extra
    if(reto.fechaInicio > reto.fechaFin){
      this.snackBar.open('La fecha de inicio no puede ser posterior a la fecha de fin', 'Cerrar', {duration: 4000});
      return;
    }

    if(reto.descripcion.split(/\s+/).length > 100){
      this.snackBar.open('La descripción no puede superar las 100 palabras', 'Cerrar', {duration: 4000});
      return;
    }

    if(this.modoEdicion){
      this.rS.update(reto).subscribe({
        next: () => {
          this.rS.list().subscribe(data => this.rS.setList(data));
          this.router.navigate(['/home/retos/listar']);
        },
        error: err => {
          console.error(err);
        }
      });
    } else {
      this.rS.insert(reto).subscribe({
        next: () => {
          this.rS.list().subscribe(data => this.rS.setList(data));
          this.router.navigate(['/home/retos/listar']);
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }

  cancelar() { this.router.navigate(['/home']); }
}