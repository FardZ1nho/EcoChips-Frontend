import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Modelos
import { UsuarioRecomendacion } from '../../../models/UsuarioRecomendacion';
import { Usuario } from '../../../models/Usuario';
import { Recomendacion } from '../../../models/Recomendacion';
import { UsuarioRecomendacionService } from '../../../services/usuariorecomendacion';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Recomendacionservice } from '../../../services/recomendacionservice';

// Servicios (Asegúrate de que los nombres de archivo sean correctos)


@Component({
  selector: 'app-usuariorecomendacioncrear',
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
    MatIconModule, 
    RouterLink
  ],
  templateUrl: './usuariorecomendacioncrear.html',
  styleUrls: ['./usuariorecomendacioncrear.css']
})
export class UsuarioRecomendacionCrear implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  titulo: string = "Asignar Recomendación";

  // Listas para los desplegables
  listaUsuarios: Usuario[] = [];
  listaRecomendaciones: Recomendacion[] = [];

  constructor(
    private fb: FormBuilder,
    private urS: UsuarioRecomendacionService,
    private uS: Usuarioservice,       // Corregido: Tipo UsuarioService
    private rS: Recomendacionservice, // Corregido: Tipo RecomendacionService
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1. Cargar listas para los selects
    this.uS.list().subscribe(data => this.listaUsuarios = data);
    this.rS.list().subscribe(data => this.listaRecomendaciones = data);

    // 2. Inicializar formulario
    this.form = this.fb.group({
      idUsuarioRecomendacion: [''],
      idUsuario: ['', Validators.required],       // Guarda el ID del usuario
      idRecomendacion: ['', Validators.required], // Guarda el ID de la recomendación
      fechaAsignacion: [new Date(), Validators.required]
    });

    // 3. Verificar si es edición
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.edicion = true;
        this.titulo = "Editar Asignación";
        this.init();
      }
    });
  }

  init() {
    this.urS.listId(this.id).subscribe(data => {
      // Como el backend devuelve un DTO plano, accedemos directamente a las propiedades
      this.form.patchValue({
        idUsuarioRecomendacion: data.idUsuarioRecomendacion,
        idUsuario: data.idUsuario,             // Correcto: propiedad plana
        idRecomendacion: data.idRecomendacion, // Correcto: propiedad plana
        fechaAsignacion: data.fechaAsignacion
      });
    });
  }

  aceptar() {
    if (this.form.valid) {
      // Usamos 'any' para poder asignar null al ID si es nuevo
      const ur: any = new UsuarioRecomendacion();
      
      // Control de ID (null para insertar, número para actualizar)
      if (this.edicion) {
        ur.idUsuarioRecomendacion = this.id;
      } else {
        ur.idUsuarioRecomendacion = null;
      }

      // Asignamos los valores del formulario al objeto
      ur.idUsuario = this.form.value.idUsuario;
      ur.idRecomendacion = this.form.value.idRecomendacion;

      // Formateo de fecha para evitar errores de zona horaria
      const fechaForm = this.form.value.fechaAsignacion;
      if (fechaForm instanceof Date) {
         const year = fechaForm.getFullYear();
         const month = (fechaForm.getMonth() + 1).toString().padStart(2, '0');
         const day = fechaForm.getDate().toString().padStart(2, '0');
         ur.fechaAsignacion = `${year}-${month}-${day}`;
      } else {
         ur.fechaAsignacion = fechaForm;
      }

      // Lógica de guardado
      if (this.edicion) {
        this.urS.update(ur).subscribe(() => {
          this.urS.list().subscribe(d => this.urS.setList(d));
          this.router.navigate(['/home/usuariorecomendacion/listar']);
        });
      } else {
        this.urS.insert(ur).subscribe({
          next: () => {
            this.urS.list().subscribe(d => this.urS.setList(d));
            this.router.navigate(['/home/usuariorecomendacion/listar']);
          },
          error: (e) => console.error("Error al asignar:", e)
        });
      }
    }
  }
}