import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ParticipacionReto } from '../../../models/ParticipacionReto';
import { ParticipacionRetoService } from '../../../services/participacionretoservice';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-participacionretocrear',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './participacionretocrear.html',
  styleUrls: ['./participacionretocrear.css']
})
export class ParticipacionRetoCrear implements OnInit {
  form!: FormGroup;
  modoEdicion: boolean = false;
  titulo: string = 'Registrar Participación';

  constructor(
    private prS: ParticipacionRetoService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idParticipacion: [0], // campo oculto para edición
      idUsuario: ['', Validators.required],
      idReto: ['', Validators.required],
      completado: [false, Validators.required]
    });
    this.route.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.modoEdicion = true;
        this.titulo = 'Editar Participación';
        const id = +idParam;
        this.prS.listId(id).subscribe({
          next: (data: ParticipacionReto) => {
            this.form.patchValue({
              idParticipacion: data.idParticipacion,
              idUsuario: data.idUsuario,
              idReto: data.idReto,
              completado: data.completado ? 'true' : 'false'
            });
          },
          error: err => {
            console.error('Error cargando participación:', err);
            this.snackBar.open('No se pudo cargar la participación para editar', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/home/participacionretos']);
          }
        });
      }
    });
  }

  registrar() {
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    const participacion: ParticipacionReto = {
      idParticipacion: this.form.value.idParticipacion,
      idUsuario: Number(this.form.value.idUsuario),
      idReto: Number(this.form.value.idReto),
      completado: this.form.value.completado === 'true'
    };

    if(this.modoEdicion){
      this.prS.update(participacion).subscribe({
        next: () => {
          this.prS.list().subscribe(data => this.prS.setList(data));
          this.router.navigate(['/home/participacionretos/listar']);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error al modificar la participación', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/home/participacionretos/listar']);
        }
      });
    } else {
      this.prS.insert(participacion).subscribe({
        next: () => {
          this.prS.list().subscribe(data => this.prS.setList(data));
          this.router.navigate(['/home/participacionretos/listar']);
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error al registrar la participación', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
  cancelar() { this.router.navigate(['/home']); }
}