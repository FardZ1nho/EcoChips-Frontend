import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Evento } from '../../../models/Evento';
import { Eventoservice } from '../../../services/eventoservice';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-eventocrear',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './eventocrear.html',
  styleUrls: ['./eventocrear.css']
})
export class EventoCrear implements OnInit {

  form!: FormGroup;
  modoEdicion: boolean = false;
  titulo: string = 'Registrar Evento';

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
      hora: ['', Validators.required],
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
            this.form.patchValue(data);
          },
          error: err => {
            console.error('Error cargando evento:', err);
            this.snackBar.open('No se pudo cargar el evento para editar', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/eventos']);
          }
        });
      }
    });
  }

  guardar() {
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    const evento: Evento = this.form.value;

    if(this.modoEdicion){
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
  cancelar() { this.router.navigate(['/home']); }
}
