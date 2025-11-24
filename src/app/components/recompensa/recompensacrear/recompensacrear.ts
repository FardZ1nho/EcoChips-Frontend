import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Recompensa } from '../../../models/Recompensa';
import { RecompensaService } from '../../../services/recompensa';


@Component({
  selector: 'app-recompensacrear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './recompensacrear.html',
  styleUrls: ['./recompensacrear.css']
})
export class Recompensacrear implements OnInit {
  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
  titulo: string = "Crear Recompensa";

  constructor(
    private fb: FormBuilder,
    private rS: RecompensaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      idRecompensa: [''],
      tituloRecompensa: ['', [Validators.required, Validators.maxLength(50)]],
      descripcionRecompensa: ['', [Validators.required, Validators.maxLength(255)]],
      costoCanjes: ['', [Validators.required, Validators.min(1)]]
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.edicion = true;
        this.titulo = "Editar Recompensa";
        this.init();
      }
    });
  }

  init() {
    this.rS.listId(this.id).subscribe(data => {
      this.form.patchValue({
        idRecompensa: data.idRecompensa,
        tituloRecompensa: data.tituloRecompensa,
        descripcionRecompensa: data.descripcionRecompensa,
        costoCanjes: data.costoCanjes
      });
    });
  }

  aceptar() {
    if (this.form.valid) {
      // Usamos 'any' para poder poner el ID en null
      const recompensa: any = new Recompensa();
      
      // --- EVITAR ERROR 500 ---
      if (this.edicion) {
        recompensa.idRecompensa = this.id;
      } else {
        recompensa.idRecompensa = null; 
      }
      // -----------------------

      recompensa.tituloRecompensa = this.form.value.tituloRecompensa;
      recompensa.descripcionRecompensa = this.form.value.descripcionRecompensa;
      recompensa.costoCanjes = this.form.value.costoCanjes;

      if (this.edicion) {
        this.rS.update(recompensa).subscribe(() => {
          this.rS.list().subscribe(d => this.rS.setList(d));
          this.router.navigate(['/home/recompensas/listar']);
        });
      } else {
        this.rS.insert(recompensa).subscribe({
          next: () => {
            this.rS.list().subscribe(d => this.rS.setList(d));
            this.router.navigate(['/home/recompensas/listar']);
          },
          error: (e) => console.error(e)
        });
      }
    }
  }
}