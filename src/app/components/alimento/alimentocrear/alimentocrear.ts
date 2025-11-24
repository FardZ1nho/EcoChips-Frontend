import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Alimento } from '../../../models/Alimento';
import { AlimentoService } from '../../../services/alimento';


interface TipoAlimento {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-alimentocrear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './alimentocrear.html',
  styleUrls: ['./alimentocrear.css']
})
export class Alimentocrear implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  titulo: string = "Registrar Alimento";

  listaTipos: TipoAlimento[] = [
    { value: 'Carnes Rojas', viewValue: 'Carnes Rojas (Res, Cerdo)' },
    { value: 'Aves y Huevos', viewValue: 'Aves y Huevos' },
    { value: 'Pescados', viewValue: 'Pescados y Mariscos' },
    { value: 'Lacteos', viewValue: 'Lácteos (Queso, Leche)' },
    { value: 'Frutas y Verduras', viewValue: 'Frutas y Verduras' },
    { value: 'Cereales', viewValue: 'Cereales, Pan y Pastas' },
    { value: 'Legumbres', viewValue: 'Legumbres y Frutos Secos' },
    { value: 'Procesados', viewValue: 'Comida Procesada / Snacks' },
    { value: 'Bebidas', viewValue: 'Bebidas y Jugos' }
  ];

  constructor(
    private fb: FormBuilder,
    private aS: AlimentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idAlimento: [''],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', Validators.required], 
      co2Porcion: ['', [Validators.required, Validators.min(0)]]
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.edicion = true;
        this.titulo = "Editar Alimento";
        this.init();
      }
    });
  }

  init() {
    this.aS.listId(this.id).subscribe(data => {
      this.form.patchValue({
        idAlimento: data.idAlimento,
        nombre: data.nombre,
        tipo: data.tipo,
        co2Porcion: data.co2Porcion
      });
    });
  }

  aceptar() {
  if (this.form.valid) {
    const alimento: any = new Alimento();
    
    if (this.edicion) {
      alimento.idAlimento = this.id;
    } else {
      alimento.idAlimento = null; 
    }

    alimento.nombre = this.form.value.nombre;
    alimento.tipo = this.form.value.tipo;

    alimento.co2Porcion = this.form.value.co2Porcion; 

    if (this.edicion) {
      this.aS.update(alimento).subscribe(() => {
        this.aS.list().subscribe(d => this.aS.setList(d));
        this.router.navigate(['/home/alimentos/listar']);
      });
    } else {
      this.aS.insert(alimento).subscribe({
        next: () => {
          this.aS.list().subscribe(d => this.aS.setList(d));
          this.router.navigate(['/home/alimentos/listar']);
        },
        error: (e) => console.error(e)
      });
    }
  }
}
}