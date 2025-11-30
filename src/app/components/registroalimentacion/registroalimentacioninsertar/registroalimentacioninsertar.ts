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
import { MatCardModule } from '@angular/material/card';

// Modelos
import { RegistroAlimentacion } from '../../../models/RegistroAlimentacion';
import { Usuario } from '../../../models/Usuario';
import { Alimento } from '../../../models/Alimento';

// Servicios
import { RegistroAlimentacionService } from '../../../services/registroalimentacionservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { AlimentoService } from '../../../services/alimento';
import { AuthService } from '../../../services/authservice';


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
    MatIconModule,
    RouterLink,
    MatCardModule
  ],
  templateUrl: './registroalimentacioninsertar.html',
  styleUrls: ['./registroalimentacioninsertar.css']
})
export class Registroalimentacioninsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  titulo: string = "Registrar Alimentación";

  listaUsuarios: Usuario[] = [];
  listaAlimentos: Alimento[] = [];
  fechaMaxima: Date = new Date(); // Se usará en el HTML [max]="fechaMaxima" si lo deseas

  constructor(
    private fb: FormBuilder,
    private raS: RegistroAlimentacionService,
    private uS: Usuarioservice,
    private aS: AlimentoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Cargar listas
    this.uS.list().subscribe(data => this.listaUsuarios = data);
    this.aS.list().subscribe(data => this.listaAlimentos = data);

    // Obtener ID del usuario logueado
    const usuarioLogueadoId = this.authService.getCurrentUserId();

    // Inicializar formulario
    this.form = this.fb.group({
      idRegistroAlimentacion: [''],
      
      // Usuario: Sigue bloqueado (disabled: true) porque debe ser el usuario logueado
      usuario: [{ value: usuarioLogueadoId, disabled: true }, Validators.required],
      
      alimento: ['', Validators.required],
      porciones: ['', [Validators.required, Validators.min(1)]],
      
      // CAMBIO: Fecha con valor por defecto (hoy) pero EDITABLE (sin disabled: true)
      fecha: [new Date(), Validators.required]
    });

    // Verificar edición
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
      
      // Solo bloqueamos el usuario, permitimos editar la fecha si se desea
      this.form.get('usuario')?.disable();
    });
  }

  // Validación para que no elijan fechas futuras
  validarFechaNoFutura(): boolean {
    const fechaSeleccionada = this.form.get('fecha')?.value; // Usamos .get() normal ya que está habilitado
    if (!fechaSeleccionada) return true;

    const fecha = new Date(fechaSeleccionada);
    const hoy = new Date();
    
    // Ignoramos la hora para comparar solo fechas
    hoy.setHours(0, 0, 0, 0);
    fecha.setHours(0, 0, 0, 0);

    return fecha <= hoy;
  }

  aceptar() {
    if (this.form.valid) {
      if (!this.validarFechaNoFutura()) {
        alert('La fecha no puede ser posterior a la fecha actual');
        return;
      }

      const registro: any = new RegistroAlimentacion();
      
      if (this.edicion) {
        registro.idRegistroAlimentacion = this.id;
      } else {
        registro.idRegistroAlimentacion = null; 
      }

      // Usamos getRawValue() principalmente por el campo 'usuario' que está disabled
      const datosFormulario = this.form.getRawValue();

      registro.idUsuario = datosFormulario.usuario;
      registro.idAlimento = datosFormulario.alimento;
      registro.porciones = datosFormulario.porciones;
      
      // Formateo de fecha
      const fechaForm = datosFormulario.fecha;
      if (fechaForm instanceof Date) {
        const year = fechaForm.getFullYear();
        const month = (fechaForm.getMonth() + 1).toString().padStart(2, '0');
        const day = fechaForm.getDate().toString().padStart(2, '0');
        registro.fecha = `${year}-${month}-${day}`;
      } else {
        registro.fecha = fechaForm;
      }

      // Guardar
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
          error: (e) => console.error("Error al registrar alimentación:", e)
        });
      }
    }
  }
}