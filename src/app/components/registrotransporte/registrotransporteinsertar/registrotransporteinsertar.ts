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
import { MatIconModule } from '@angular/material/icon';

import { RegistroTransporte } from '../../../models/RegistroTransporte';
import { Usuario } from '../../../models/Usuario';
import { Transporte } from '../../../models/Transporte';

import { Transporteservice } from '../../../services/transporteservice';
import { RegistroTransporteService } from '../../../services/registrotransporteservice';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-registrotransporteinsertar',
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
  templateUrl: './registrotransporteinsertar.html',
  styleUrls: ['./registrotransporteinsertar.css']
})
export class RegistroTransporteInsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  titulo: string = "Registrar Uso de Transporte";

  listaUsuarios: Usuario[] = [];
  listaTransportes: Transporte[] = [];
  fechaMaxima: Date = new Date(); // Fecha máxima = hoy

  constructor(
    private fb: FormBuilder,
    private rts: RegistroTransporteService,
    private uS: Usuarioservice,
    private tS: Transporteservice,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.uS.list().subscribe(data => this.listaUsuarios = data);
    this.tS.list().subscribe(data => this.listaTransportes = data);

    this.form = this.fb.group({
      idRegistroTransporte: [''],
      usuario: ['', Validators.required],
      transporte: ['', Validators.required],
      distanciaKm: ['', [Validators.required, Validators.min(0.1)]],
      fecha: [new Date(), Validators.required]
      // NOTA: Eliminamos co2Emision del formulario ya que se calculará automáticamente
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
    this.rts.listId(this.id).subscribe(data => {
      this.form.patchValue({
        idRegistroTransporte: data.idRegistroTransporte,
        usuario: data.idUsuario,
        transporte: data.idTransporte,
        distanciaKm: data.distanciaKm,
        fecha: data.fecha
        // NOTA: No mostramos co2Emitido en el formulario de edición
      });
    });
  }

  // Función para validar que la fecha no sea futura
  validarFechaNoFutura(): boolean {
    const fechaSeleccionada = this.form.get('fecha')?.value;
    if (!fechaSeleccionada) return true;

    const fecha = new Date(fechaSeleccionada);
    const hoy = new Date();
    
    // Resetear horas para comparar solo fechas
    hoy.setHours(0, 0, 0, 0);
    fecha.setHours(0, 0, 0, 0);

    return fecha <= hoy;
  }

  aceptar() {
    if (this.form.valid) {
      // Validar que la fecha no sea futura
      if (!this.validarFechaNoFutura()) {
        alert('La fecha no puede ser posterior a la fecha actual');
        return;
      }

      const reg: any = new RegistroTransporte();
      
      if (this.edicion) {
        reg.idRegistroTransporte = this.id;
      } else {
        reg.idRegistroTransporte = null; 
      }

      // IMPORTANTE: Cambiamos la estructura para que coincida con el DTO del backend
      reg.idUsuario = this.form.value.usuario; // Enviar solo el ID del usuario
      reg.idTransporte = this.form.value.transporte; // Enviar solo el ID del transporte
      reg.distanciaKm = this.form.value.distanciaKm;
      
      // NOTA: El campo co2Emitido NO se envía - el backend lo calculará automáticamente
      // reg.co2Emitido = 0; // No enviar este campo

      const fechaForm = this.form.value.fecha;
      if (fechaForm instanceof Date) {
        const year = fechaForm.getFullYear();
        const month = (fechaForm.getMonth() + 1).toString().padStart(2, '0');
        const day = fechaForm.getDate().toString().padStart(2, '0');
        reg.fecha = `${year}-${month}-${day}`;
      } else {
        reg.fecha = fechaForm;
      }

      if (this.edicion) {
        // Aquí va la lógica para editar si es necesario
        this.rts.update(reg).subscribe(() => {
          this.rts.list().subscribe(d => this.rts.setList(d));
          this.router.navigate(['/home/registrostransporte/listar']);
        });
      } else {
        this.rts.insert(reg).subscribe({
          next: () => {
            this.rts.list().subscribe(d => this.rts.setList(d));
            this.router.navigate(['/home/registrostransporte/listar']);
          },
          error: (e) => console.error("Error:", e)
        });
      }
    }
  }
}