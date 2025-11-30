import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Modelos
import { RegistroTransporte } from '../../../models/RegistroTransporte';

// Servicios
import { RegistroTransporteService } from '../../../services/registrotransporteservice';

import { Transporteservice } from '../../../services/transporteservice';
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-registrotransporte-listar-por-usuario',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatIconModule, MatCardModule, 
    CommonModule, FormsModule
  ],
  templateUrl: './listar-por-usuario.html',
  styleUrls: ['./listar-por-usuario.css']
})
export class RegistroTransporteListarPorUsuarioComponent implements OnInit {
  
  dataSource: MatTableDataSource<RegistroTransporte> = new MatTableDataSource();
  
  // Columnas a mostrar
  displayedColumns: string[] = ['id', 'usuario', 'transporte', 'distancia', 'co2', 'fecha'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  idUsuarioBuscar: number | null = null;
  mensaje: string = "Ingrese un ID de usuario para ver sus viajes";
  busquedaRealizada: boolean = false;

  // Mapas para traducir IDs a Nombres
  mapaUsuarios: Map<number, string> = new Map();
  mapaTransportes: Map<number, string> = new Map();

  constructor(
    private rtS: RegistroTransporteService,
    private uS: Usuarioservice,
    private tS: Transporteservice
  ) {}

  ngOnInit(): void {
    this.cargarDiccionarios();
  }

  cargarDiccionarios() {
    // 1. Cargar Nombres de Usuarios
    this.uS.list().subscribe(data => {
      data.forEach(u => this.mapaUsuarios.set(u.idUsuario, u.nombre));
    });

    // 2. Cargar Nombres de Transportes
    this.tS.list().subscribe(data => {
      data.forEach(t => this.mapaTransportes.set(t.idTransporte, t.nombre)); // Asumiendo que Transporte tiene 'nombre' o 'tipo'
    });
  }

  buscar() {
    if (this.idUsuarioBuscar) {
      this.busquedaRealizada = true;
      
      this.rtS.listarPorUsuario(this.idUsuarioBuscar).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          
          if (data.length === 0) {
            this.mensaje = "Este usuario no ha registrado transportes.";
          } else {
            this.mensaje = "";
          }
        },
        error: (err) => {
          console.error(err);
          this.dataSource.data = [];
          this.mensaje = "Error al buscar o usuario no encontrado.";
        }
      });
    }
  }

  // --- Funciones para el HTML ---

  getNombreUsuario(id: number): string {
    return this.mapaUsuarios.get(id) || `ID: ${id}`;
  }

  getNombreTransporte(id: number): string {
    return this.mapaTransportes.get(id) || `ID: ${id}`;
  }
}