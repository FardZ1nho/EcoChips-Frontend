import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

import { SoporteSolicitud } from '../../../models/SoporteSolicitud';
import { SoporteSolicitudService } from '../../../services/soportesolicitudservice'; 
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { AuthService } from '../../../services/authservice'; // ✅ IMPORTAR

@Component({
  selector: 'app-soportesolicitudinsertar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,           
    MatFormFieldModule,    
    MatInputModule,        
    MatButtonModule,      
    MatSelectModule,       
    MatNativeDateModule,   
    ReactiveFormsModule,   
    MatIconModule,   
    MatDatepickerModule,
    RouterLink      
  ],
  templateUrl: './soportesolicitudinsertar.html',
  styleUrl: './soportesolicitudinsertar.css',
})
export class SoporteSolicitudInsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;
  titulo: string = "Registrar Solicitud de Soporte";
  fechaActual: Date = new Date();

  listaUsuarios: Usuario[] = [];

  apartados: string[] = [
    'Retos',
    'Transportes',
    'Eventos',
    'Alimentos',
    'Recompensas',
    'Usuarios',
    'Participación',
    'Registro Transporte',
    'Registro Evento',
    'Otro'
  ];

  constructor(
    private sS: SoporteSolicitudService,
    private uS: Usuarioservice,
    private authService: AuthService, // ✅ INYECTAR AUTH SERVICE
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.uS.list().subscribe(data => this.listaUsuarios = data);

    // ✅ OBTENER ID DEL USUARIO LOGUEADO
    const usuarioLogueadoId = this.authService.getCurrentUserId();

    this.form = this.formBuilder.group({
      idSoporteSolicitud: [''], 
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [
        Validators.required, 
        Validators.maxLength(1000)
      ]],
      fechahora: [{value: this.fechaActual, disabled: true}, Validators.required],
      Apartado: ['', Validators.required],
      // ✅ CAMPO USUARIO: valor por defecto y DESHABILITADO
      usuario: [{ value: usuarioLogueadoId, disabled: true }, Validators.required]
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null; 
      
      if (this.edicion) {
        this.titulo = "Editar Solicitud de Soporte";
        this.init(); 
      }
    });
  }

  aceptar(): void {
    if (this.form.valid && this.validarPalabras()) {
      // ✅ USAR getRawValue() PARA LEER CAMPOS DESHABILITADOS
      const datosFormulario = this.form.getRawValue();

      // Crear el objeto con la estructura correcta para el DTO
      const solicitudData = {
        idSoporteSolicitud: this.edicion ? this.id : 0,
        titulo: datosFormulario.titulo,
        descripcion: datosFormulario.descripcion,
        fechahora: this.formatearLocalDateTime(this.fechaActual),
        apartado: datosFormulario.Apartado,
        idUsuario: datosFormulario.usuario // ✅ Ahora sí lee el usuario
      };

      console.log('✅ Enviando datos:', solicitudData);

      if (this.edicion) {
        this.sS.update(solicitudData).subscribe({
          next: () => {
            this.sS.list().subscribe((data) => {
              this.sS.setList(data);
              this.router.navigate(['/home/soportesolicitudes/listar']); 
            });
          },
          error: (err) => {
            console.error('❌ Error al actualizar:', err);
            alert('Error al actualizar la solicitud: ' + err.error);
          }
        });
      } else {
        this.sS.insert(solicitudData).subscribe({
          next: () => {
            this.sS.list().subscribe((data) => {
              this.sS.setList(data);
              this.router.navigate(['/home/soportesolicitudes/listar']);
            });
          },
          error: (err) => {
            console.error('❌ Error al insertar:', err);
            alert('Error al registrar la solicitud: ' + err.error);
          }
        });
      }
    } else {
      this.form.markAllAsTouched();
      if (!this.validarPalabras()) {
        alert('La descripción debe tener entre 20 y 255 palabras');
      }
    }
  }

  // Formatear fecha para LocalDateTime (formato ISO)
  formatearLocalDateTime(fecha: Date): string {
    return fecha.toISOString().slice(0, 19); // "2024-01-15T10:30:00"
  }

  init() {
    if (this.edicion) {
      this.sS.listId(this.id).subscribe({
        next: (data) => {
          // Convertir la fecha string a Date
          let fechaData: Date;
          if (typeof data.fechahora === 'string') {
            fechaData = new Date(data.fechahora);
          } else {
            fechaData = new Date();
          }
          
          this.form.patchValue({
            idSoporteSolicitud: data.idSoporteSolicitud,
            titulo: data.titulo,
            descripcion: data.descripcion,
            fechahora: fechaData,
            Apartado: data.apartado,
            usuario: data.idUsuario
          });

          // ✅ Asegurar que el usuario siga bloqueado en edición
          this.form.get('usuario')?.disable();
        },
        error: (err) => {
          console.error('❌ Error al cargar datos:', err);
          alert('Error al cargar los datos de la solicitud');
        }
      });
    }
  }

  contarPalabras(): number {
    const descripcion = this.form.get('descripcion')?.value || '';
    return descripcion.trim() === '' ? 0 : descripcion.trim().split(/\s+/).length;
  }

  validarPalabras(): boolean {
    const palabras = this.contarPalabras();
    return palabras >= 20 && palabras <= 255;
  }
}