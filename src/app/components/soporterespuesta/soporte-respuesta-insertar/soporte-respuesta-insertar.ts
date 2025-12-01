import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// Servicios
import { SoporteRespuestaService } from '../../../services/soporterespuestaservice'; 
import { SoporteSolicitudService } from '../../../services/soportesolicitudservice'; 
import { AuthService } from '../../../services/authservice'; 
import { SoporteSolicitud } from '../../../models/SoporteSolicitud'; 

@Component({
  selector: 'app-soporte-respuesta-insertar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './soporte-respuesta-insertar.html',
  styleUrls: ['./soporte-respuesta-insertar.css']
})
export class SoporteRespuestaInsertar implements OnInit {
  
  form: FormGroup = new FormGroup({});
  idSolicitud: number = 0;
  solicitudDetalle: SoporteSolicitud | null = null; 

  constructor(
    private sR: SoporteRespuestaService, 
    private sS: SoporteSolicitudService, 
    private authService: AuthService, 
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      mensaje: ['', [Validators.required, Validators.maxLength(500)]]
    });

    const storedId = localStorage.getItem('idSolicitudAResponder');
    if (storedId) {
      this.idSolicitud = +storedId;
      this.cargarDetallesSolicitud(this.idSolicitud);
    } else {
      this.router.navigate(['/home/soportesolicitudes/listar']);
    }
  }

  cargarDetallesSolicitud(id: number) {
    this.sS.listId(id).subscribe({
      next: (data) => this.solicitudDetalle = data,
      error: (e) => console.error(e)
    });
  }

  registrar() {
    if (this.form.valid && this.idSolicitud > 0) {
      
      // 1. Obtener ID del usuario administrador logueado
      const usuarioActual = this.authService.getUsuarioActual();
      const idAdmin = usuarioActual ? usuarioActual.idUsuario : 0; 

      // 2. Crear objeto EXACTAMENTE como lo pide tu SoporteRespuestaDTO en Java
      const nuevaRespuesta = {
        respuesta: this.form.value.mensaje, // Java espera 'respuesta'
        fechahora: new Date().toISOString(), // Java espera 'fechahora'
        idSolicitud: this.idSolicitud,       // Java espera int 'idSolicitud'
        idUsuarioRespuesta: idAdmin          // Java espera int 'idUsuarioRespuesta'
      };

      console.log("Enviando al backend:", nuevaRespuesta);

      this.sR.insert(nuevaRespuesta).subscribe({
        next: () => {
          alert('✅ Respuesta enviada correctamente');
          localStorage.removeItem('idSolicitudAResponder');
          this.router.navigate(['/home/soportesolicitudes/listar']);
        },
        error: (err) => {
          console.error('❌ Error al insertar respuesta:', err);
          alert('Error al enviar. Revisa la consola para detalles.');
        }
      });
    }
  }
}