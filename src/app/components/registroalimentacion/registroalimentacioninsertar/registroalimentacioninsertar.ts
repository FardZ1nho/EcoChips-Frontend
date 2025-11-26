import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

import { RegistroAlimentacion } from '../../../models/RegistroAlimentacion';
import { Usuario } from '../../../models/Usuario';
import { Alimento } from '../../../models/Alimento';
import { RegistroAlimentacionService } from '../../../services/registroalimentacionservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { AlimentoService } from '../../../services/alimento';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-registroalimentacioninsertar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterLink,
    MatCardModule
  ],
  templateUrl: './registroalimentacioninsertar.html',
  styleUrl: './registroalimentacioninsertar.css'
})
export class Registroalimentacioninsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  titulo: string = "Registrar Alimentación";

  listaUsuarios: Usuario[] = [];
  listaAlimentos: Alimento[] = [];

  constructor(
    private fb: FormBuilder,
    private raS: RegistroAlimentacionService,
    private uS: Usuarioservice,
    private aS: AlimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.uS.list().subscribe(data => this.listaUsuarios = data);
    this.aS.list().subscribe(data => this.listaAlimentos = data);

    this.form = this.fb.group({
      idRegistroAlimentacion: [''],
      usuario: ['', Validators.required],
      alimento: ['', Validators.required],
      porciones: ['', [Validators.required, Validators.min(1)]],
      fecha: [new Date(), Validators.required]
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.edicion = true;
        this.titulo = "Editar Registro";
        this.init();
      }
    });
  }

  init() {
    this.raS.listId(this.id).subscribe(data => {
      this.form.patchValue({
        idRegistroAlimentacion: data.idRegistroAlimentacion,
        usuario: data.idUsuario,
        alimento: data.idAlimento,
        porciones: data.porciones,
        fecha: data.fecha
      });
    });
  }

  aceptar() {
    if (this.form.valid) {
      const registro: any = new RegistroAlimentacion();
      
      if (this.edicion) {
        registro.idRegistroAlimentacion = this.id;
      } else {
        registro.idRegistroAlimentacion = null; 
      }

      registro.idUsuario = this.form.value.usuario;
      registro.idAlimento = this.form.value.alimento;
      registro.porciones = this.form.value.porciones;
      
      const fechaForm = this.form.value.fecha;
      if (fechaForm instanceof Date) {
        const year = fechaForm.getFullYear();
        const month = (fechaForm.getMonth() + 1).toString().padStart(2, '0');
        const day = fechaForm.getDate().toString().padStart(2, '0');
        registro.fecha = `${year}-${month}-${day}`;
      } else {
        registro.fecha = fechaForm;
      }

      if (this.edicion) {
        this.raS.update(registro).subscribe(() => {
          this.raS.list().subscribe(d => this.raS.setList(d));
          this.router.navigate(['/home/registrosalimentacion/listar']);
        });
      } else {
        this.raS.insert(registro).subscribe({
          next: () => {
            this.raS.list().subscribe(d => this.raS.setList(d));
            this.router.navigate(['/home/registrosalimentacion/listar']);
          },
          error: (e) => console.error("Error:", e)
        });
      }
    }
  }
}