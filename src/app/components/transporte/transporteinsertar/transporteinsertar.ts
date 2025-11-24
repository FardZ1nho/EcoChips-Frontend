import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- AGREGADO
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // <--- OPCIONAL PERO RECOMENDADO

import { Transporte } from '../../../models/Transporte';
import { Transporteservice } from '../../../services/transporteservice';

@Component({
  selector: 'app-transporteinsertar',
  standalone: true, // <--- FALTABA ESTO
  imports: [
    CommonModule, // <--- IMPORTANTE PARA NGIF ETC
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './transporteinsertar.html',
  styleUrl: './transporteinsertar.css',
})
export class Transporteinsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;
  t: Transporte = new Transporte();

  titulo: string = "Registrar Transporte";

  constructor(
    private tS: Transporteservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1. Primero inicializamos el formulario con Validaciones
    this.form = this.formBuilder.group({
      idTransporte: [''], // <--- Usemos el nombre real del modelo para evitar confusiones
      nombre: ['', Validators.required],
      factorCo2: ['', [Validators.required, Validators.min(0)]],
    });

    // 2. Luego verificamos si es edición
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      if (this.edicion) {
        this.titulo = "Editar Transporte";
        this.init();
      }
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      // Mapeamos los datos del formulario al objeto
      this.t.idTransporte = this.edicion ? this.id : 0;
      this.t.nombre = this.form.value.nombre;
      this.t.factorCo2 = this.form.value.factorCo2;

      if (this.edicion) {
        // --- ACTUALIZAR ---
        this.tS.update(this.t).subscribe(() => {
          this.tS.list().subscribe((data) => {
            this.tS.setList(data);
            // LA NAVEGACIÓN VA AQUÍ ADENTRO
            this.router.navigate(['/home/transporte/listar']); 
          });
        });
      } else {
        // --- CREAR ---
        this.tS.insert(this.t).subscribe(() => {
          this.tS.list().subscribe((data) => {
            this.tS.setList(data);
            // LA NAVEGACIÓN VA AQUÍ ADENTRO
            this.router.navigate(['/home/transporte/listar']);
          });
        });
      }
    } else {
        // Si el formulario no es válido, marcamos todo para que salgan los errores rojos
        this.form.markAllAsTouched();
    }
  }

  init() {
    if (this.edicion) {
      this.tS.listId(this.id).subscribe((data) => {
        // CORRECCIÓN: Usamos patchValue o reset para NO PERDER LOS VALIDATORS
        this.form.patchValue({
            idTransporte: data.idTransporte,
            nombre: data.nombre,
            factorCo2: data.factorCo2
        });
      });
    }
  }
}