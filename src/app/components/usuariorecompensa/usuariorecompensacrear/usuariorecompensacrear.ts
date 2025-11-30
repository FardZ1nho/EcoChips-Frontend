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
import { UsuarioRecompensa } from '../../../models/UsuarioRecompensa';
import { Usuario } from '../../../models/Usuario';
import { Recompensa } from '../../../models/Recompensa';
import { UsuarioRecompensaService } from '../../../services/usuariorecompensa';
import { Usuarioservice } from '../../../services/usuarioservice';
import { RecompensaService } from '../../../services/recompensa';
import { AuthService } from '../../../services/authservice';


@Component({
  selector: 'app-usuariorecompensacrear',
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
  templateUrl: './usuariorecompensacrear.html',
  styleUrls: ['./usuariorecompensacrear.css']
})
export class UsuarioRecompensaCrear implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  titulo: string = "Registrar Canje";

  listaUsuarios: Usuario[] = [];
  listaRecompensas: Recompensa[] = [];

  constructor(
    private fb: FormBuilder,
    private urS: UsuarioRecompensaService,
    private uS: Usuarioservice,
    private rS: RecompensaService,
    private authService: AuthService, // Inyectamos AuthService
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Cargar listas
    this.uS.list().subscribe(data => this.listaUsuarios = data);
    this.rS.list().subscribe(data => this.listaRecompensas = data);

    // 1. OBTENER ID DEL USUARIO LOGUEADO
    const usuarioLogueadoId = this.authService.getCurrentUserId();

    // 2. INICIALIZAR FORMULARIO CON CAMPOS BLOQUEADOS
    this.form = this.fb.group({
      idUsuarioRecompensa: [''],
      
      // Usuario: Valor automático y deshabilitado
      idUsuario: [{ value: usuarioLogueadoId, disabled: true }, Validators.required],
      
      idRecompensa: ['', Validators.required],
      
      // Fecha: Valor hoy y deshabilitado
      fechaAsignacion: [{ value: new Date(), disabled: true }, Validators.required]
    });

    // Verificar si es edición
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.edicion = true;
        this.titulo = "Editar Canje";
        this.init();
      }
    });
  }

  init() {
    this.urS.listId(this.id).subscribe(data => {
      this.form.patchValue({
        idUsuarioRecompensa: data.idUsuarioRecompensa,
        idUsuario: data.idUsuario,
        idRecompensa: data.idRecompensa,
        fechaAsignacion: data.fechaAsignacion
      });
      
      // Aseguramos que sigan bloqueados al editar
      this.form.get('idUsuario')?.disable();
      this.form.get('fechaAsignacion')?.disable();
    });
  }

  aceptar() {
    if (this.form.valid) {
      const ur: any = new UsuarioRecompensa();
      
      if (this.edicion) {
        ur.idUsuarioRecompensa = this.id;
      } else {
        ur.idUsuarioRecompensa = null;
      }

      // 3. USAR getRawValue() PARA LEER LOS CAMPOS BLOQUEADOS
      const datosFormulario = this.form.getRawValue();

      ur.idUsuario = datosFormulario.idUsuario;
      ur.idRecompensa = datosFormulario.idRecompensa;

      // Formateo de fecha
      const fechaForm = datosFormulario.fechaAsignacion;
      if (fechaForm instanceof Date) {
         const year = fechaForm.getFullYear();
         const month = (fechaForm.getMonth() + 1).toString().padStart(2, '0');
         const day = fechaForm.getDate().toString().padStart(2, '0');
         ur.fechaAsignacion = `${year}-${month}-${day}`;
      } else {
         ur.fechaAsignacion = fechaForm;
      }

      // Guardar
      if (this.edicion) {
        this.urS.update(ur).subscribe(() => {
          this.urS.list().subscribe(d => this.urS.setList(d));
          this.router.navigate(['/home/usuariorecompensa/listar']);
        });
      } else {
        this.urS.insert(ur).subscribe({
          next: () => {
            this.urS.list().subscribe(d => this.urS.setList(d));
            this.router.navigate(['/home/usuariorecompensa/listar']);
          },
          error: (e) => console.error("Error al registrar canje:", e)
        });
      }
    }
  }
}