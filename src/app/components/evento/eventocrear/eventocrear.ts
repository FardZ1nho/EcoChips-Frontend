import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Evento } from '../../../models/Evento';
import { Eventoservice } from '../../../services/eventoservice';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-eventocrear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule
  ],
  templateUrl: './eventocrear.html',
  styleUrls: ['./eventocrear.css']
})
export class EventoCrear implements OnInit {

  form!: FormGroup;
  modoEdicion: boolean = false;
  titulo: string = 'Registrar Evento';
  minFecha: Date = new Date(); // Fecha mínima: hoy

  constructor(
    private eS: Eventoservice,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idEvento: [0],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', [Validators.required, this.horaMinimaValidator]],
      direccion: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.modoEdicion = true;
        this.titulo = 'Editar Evento';
        const id = +idParam;

        this.eS.listId(id).subscribe({
          next: (data: Evento) => {
            // --- CONVERTIR FECHA Y HORA ---
            const fechaObj = new Date(data.fecha); // Fecha a Date
            let horaObj: any = data.hora;

            if (typeof data.hora === 'string' && data.hora.includes(':')) {
              const [h, m] = data.hora.split(':').map(Number);
              horaObj = { hour: h, minute: m };
            }

            this.form.patchValue({
              ...data,
              fecha: fechaObj,
              hora: horaObj
            });
          },
          error: err => {
            console.error(err);
            this.snackBar.open('No se pudo cargar el evento para editar', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/home/eventos/listar']);
          }
        });
      }
    });
  }

  // ---------------------------------------
  // VALIDACIÓN DE HORA DESDE 6 AM
  // ---------------------------------------
  horaMinimaValidator(control: any) {
    if (!control.value) return null;

    let hour: number = 0;

    const value = control.value;

    // Caso 1: formato string "HH:mm"
    if (typeof value === 'string' && value.includes(':')) {
      hour = parseInt(value.split(':')[0], 10);
    }
    // Caso 2: si devuelve un Date
    else if (value instanceof Date) {
      hour = value.getHours();
    }
    // Caso 3: objeto { hour, minute }
    else if (typeof value === 'object' && value.hour !== undefined) {
      hour = value.hour;
    }

    return hour < 6 ? { horaInvalida: true } : null;
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Convertir la hora a string HH:mm antes de enviar al backend
    const formValue = this.form.value;
    let horaString = formValue.hora;
    if (typeof formValue.hora === 'object' && formValue.hora.hour !== undefined) {
      const h = formValue.hora.hour.toString().padStart(2, '0');
      const m = formValue.hora.minute.toString().padStart(2, '0');
      horaString = `${h}:${m}`;
    }

    const evento: Evento = {
      ...formValue,
      hora: horaString
    };

    if (this.modoEdicion) {
      this.eS.update(evento).subscribe({
        next: () => {
          this.eS.list().subscribe(data => this.eS.setList(data));
          this.router.navigate(['/home/eventos/listar']);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error al modificar el evento', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.eS.insert(evento).subscribe({
        next: () => {
          this.eS.list().subscribe(data => this.eS.setList(data));
          this.router.navigate(['/home/eventos/listar']);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error al registrar el evento', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/home/eventos/listar']);
  }
}
