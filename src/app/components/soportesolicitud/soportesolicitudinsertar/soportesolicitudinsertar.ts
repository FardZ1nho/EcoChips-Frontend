import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
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
import { MatNativeDateModule } from '@angular/material/core';

import { SoporteSolicitud } from '../../../models/SoporteSolicitud';
import { SoporteSolicitudService } from '../../../services/soportesolicitudservice'; 


@Component({
  selector: 'app-soportesolicitudinsertar',
  standalone: true,
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
  
  s: SoporteSolicitud = new SoporteSolicitud();

  titulo: string = "Registrar Solicitud de Soporte";

 
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
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

 
  ngOnInit(): void {
    
  
    this.form = this.formBuilder.group({
      idSoporteSolicitud: [''], 
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      fechahora: [new Date(), Validators.required], 
      Apartado: ['', Validators.required],
      idUsuario: [1, [Validators.required, Validators.min(1)]] 
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
    
  
    if (this.form.valid) {
      
      
      this.s.idSoporteSolicitud = this.edicion ? this.id : 0;
      this.s.titulo = this.form.value.titulo;
      this.s.descripcion = this.form.value.descripcion;
      this.s.fechahora = this.form.value.fechahora;
      this.s.Apartado = this.form.value.Apartado;
      this.s.idUsuario = this.form.value.idUsuario;

    
      if (this.edicion) {
        
        this.sS.update(this.s).subscribe(() => {
          this.sS.list().subscribe((data) => {
            this.sS.setList(data);
            this.router.navigate(['/home/soportesolicitudes/listar']); 
          });
        });
        
      } else {
        
      
        this.sS.insert(this.s).subscribe(() => {
          this.sS.list().subscribe((data) => {
            this.sS.setList(data);
            this.router.navigate(['/home/soportesolicitudes/listar']);
          });
        });
      }
      
    } else {
      
     
      this.form.markAllAsTouched();
    }
  }

  
  init() {
    if (this.edicion) {
      
     
      this.sS.listId(this.id).subscribe((data) => {
        
       
        this.form.patchValue({
          idSoporteSolicitud: data.idSoporteSolicitud,
          titulo: data.titulo,
          descripcion: data.descripcion,
          fechahora: data.fechahora,
          Apartado: data.Apartado,
          idUsuario: data.idUsuario
        });
      });
    }
  }
}