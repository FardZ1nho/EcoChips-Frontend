import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Reto } from '../../../models/Reto';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { Retoservice } from '../../../services/retoservice';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-retocrear',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterLink, 
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  templateUrl: './retocrear.html',
  styleUrls: ['./retocrear.css']
})
export class Retocrear implements OnInit {

  form!: FormGroup;
  modoEdicion: boolean = false;
  titulo: string = 'Registrar Reto';
  minDate: Date = new Date();

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
      objetivoKg: ['', [Validators.required, Validators.min(1)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      canjesRecompensa: ['', [Validators.required, Validators.min(1)]]
    });

    this.route.params.subscribe(params => {
      const idParam = params['id'];
      if(idParam){
        this.modoEdicion = true;
        this.titulo = 'Editar Reto';
        const id = +idParam;

        this.rS.listId(id).subscribe({
          next: (data: Reto) => {
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

  initForm(data: Reto) {
    this.form = new FormGroup({
      idReto: new FormControl(data.idReto),
      titulo: new FormControl(data.titulo, Validators.required),
      descripcion: new FormControl(data.descripcion, [Validators.required, Validators.maxLength(1000)]),
      objetivoKg: new FormControl(data.objetivoKg, [Validators.required, Validators.min(1)]),
      fechaInicio: new FormControl(data.fechaInicio, Validators.required),
      fechaFin: new FormControl(data.fechaFin, Validators.required),
      canjesRecompensa: new FormControl(data.canjesRecompensa, [Validators.required, Validators.min(1)])
    });
  }

  registrar() {
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    const reto: Reto = {
      idReto: this.modoEdicion ? this.form.value.idReto : 0,
      titulo: this.form.value.titulo,
      descripcion: this.form.value.descripcion,
      objetivoKg: this.form.value.objetivoKg,
      fechaInicio: this.form.value.fechaInicio,
      fechaFin: this.form.value.fechaFin,
      canjesRecompensa: this.form.value.canjesRecompensa
    };

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
        }
      });
    } else {
      this.rS.insert(reto).subscribe({
        next: () => {
          this.rS.list().subscribe(data => this.rS.setList(data));
          this.snackBar.open('Reto registrado correctamente', 'Cerrar', {duration: 2000});
          this.router.navigate(['/home/retos/listar']);
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/home']);
  }
}
