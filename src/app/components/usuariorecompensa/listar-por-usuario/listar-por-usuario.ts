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
import { UsuarioRecompensa } from '../../../models/UsuarioRecompensa';
import { UsuarioRecompensaService } from '../../../services/usuariorecompensa';
import { Usuarioservice } from '../../../services/usuarioservice';
import { RecompensaService } from '../../../services/recompensa';

// Servicios


@Component({
  selector: 'app-usuariorecompensa-listar-por-usuario',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatIconModule, MatCardModule, 
    CommonModule, FormsModule
  ],
  templateUrl: './listar-por-usuario.html',
  styleUrls: ['./listar-por-usuario.css']
})
export class UsuarioRecompensaListarPorUsuarioComponent implements OnInit {
  
  dataSource: MatTableDataSource<UsuarioRecompensa> = new MatTableDataSource();
  
  // Columnas: ID, Usuario, Recompensa, Fecha
  displayedColumns: string[] = ['id', 'usuario', 'recompensa', 'fecha'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  idUsuarioBuscar: number | null = null;
  mensaje: string = "Ingrese un ID de usuario para ver sus canjes";
  busquedaRealizada: boolean = false;

  // Mapas para traducir IDs a Nombres
  mapaUsuarios: Map<number, string> = new Map();
  mapaRecompensas: Map<number, string> = new Map();

  constructor(
    private urS: UsuarioRecompensaService,
    private uS: Usuarioservice,
    private rS: RecompensaService
  ) {}

  ngOnInit(): void {
    this.cargarDiccionarios();
  }

  cargarDiccionarios() {
    // 1. Cargar Usuarios
    this.uS.list().subscribe(data => {
      data.forEach(u => this.mapaUsuarios.set(u.idUsuario, u.nombre));
    });

    // 2. Cargar Recompensas
    this.rS.list().subscribe(data => {
      data.forEach(r => {
        // Usamos tituloRecompensa según tu modelo
        this.mapaRecompensas.set(r.idRecompensa, r.tituloRecompensa); 
      });
    });
  }

  buscar() {
    if (this.idUsuarioBuscar) {
      this.busquedaRealizada = true;
      
      // Llama al endpoint /usuariorecompensas/usuario/{id}
      this.urS.listarPorUsuario(this.idUsuarioBuscar).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          
          if (data.length === 0) {
            this.mensaje = "Este usuario no ha canjeado recompensas.";
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

  // --- Helpers para HTML ---

  getNombreUsuario(id: number): string {
    return this.mapaUsuarios.get(id) || `ID: ${id}`;
  }

  getNombreRecompensa(id: number): string {
    return this.mapaRecompensas.get(id) || `ID: ${id}`;
  }
}