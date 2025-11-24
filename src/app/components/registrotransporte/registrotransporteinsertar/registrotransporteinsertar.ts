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
  styleUrls: ['./registrotransporteinsertar.css'] // Asegúrate de que el CSS exista
})
export class RegistroTransporteInsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  titulo: string = "Registrar Uso de Transporte";

  listaUsuarios: Usuario[] = [];
  listaTransportes: Transporte[] = [];

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
      usuario: ['', Validators.required],     // El select devuelve un ID
      transporte: ['', Validators.required],  // El select devuelve un ID
      distanciaKm: ['', [Validators.required, Validators.min(0.1)]],
      co2Emision: [''], 
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
    this.rts.listId(this.id).subscribe(data => {
      // Al editar, Java nos devuelve IDs planos (idUsuario, idTransporte)
      this.form.patchValue({
        idRegistroTransporte: data.idRegistroTransporte,
        usuario: data.idUsuario,       // Asignamos el ID al select de usuario
        transporte: data.idTransporte, // Asignamos el ID al select de transporte
        distanciaKm: data.distanciaKm,
        co2Emision: data.co2Emitido,   // Ojo: Java manda co2Emitido
        fecha: data.fecha
      });
    });
  }

  aceptar() {
  if (this.form.valid) {
    const reg: any = new RegistroTransporte();
    if (this.edicion) {
      reg.idRegistroTransporte = this.id;
    } else {
      reg.idRegistroTransporte = null; 
    }

    reg.usuario = new Usuario();
    reg.usuario.idUsuario = this.form.value.usuario;
    reg.transporte = new Transporte();
    reg.transporte.idTransporte = this.form.value.transporte;
    reg.distanciaKm = this.form.value.distanciaKm;
    reg.co2Emitido = this.form.value.co2Emision || 0;
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