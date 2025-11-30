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

import { RegistroAlimentacion } from '../../../models/RegistroAlimentacion';
import { RegistroAlimentacionService } from '../../../services/registroalimentacionservice';
// 1. IMPORTAR SERVICIO DE ALIMENTOS
import { AlimentoService } from '../../../services/alimento'; 

@Component({
  selector: 'app-registroalimentacion-listar-por-usuario',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatIconModule, MatCardModule, 
    CommonModule, FormsModule
  ],
  templateUrl: './listar-por-usuario.html',
  styleUrls: ['./listar-por-usuario.css']
})
export class RegistroAlimentacionListarPorUsuarioComponent implements OnInit {
  dataSource: MatTableDataSource<RegistroAlimentacion> = new MatTableDataSource();
  
  // Columnas a mostrar (Ajusta según tu modelo)
  displayedColumns: string[] = ['id', 'alimento', 'porciones', 'fecha'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  idUsuarioBuscar: number | null = null;
  mensaje: string = "Ingrese un ID de usuario para ver su historial de comidas";
  busquedaRealizada: boolean = false;

  // 2. MAPA PARA GUARDAR LOS NOMBRES (Diccionario)
  mapaAlimentos: Map<number, string> = new Map();

  constructor(
    private raS: RegistroAlimentacionService,
    private aS: AlimentoService // 3. INYECTAR SERVICIO
  ) {}

  ngOnInit(): void {
    // 4. CARGAR LOS ALIMENTOS AL INICIAR
    // Esto crea el "diccionario" en memoria para traducir ID -> Nombre rápido
    this.aS.list().subscribe(data => {
      data.forEach(alimento => {
        this.mapaAlimentos.set(alimento.idAlimento, alimento.nombre);
      });
    });
  }

  buscar() {
    if (this.idUsuarioBuscar) {
      this.busquedaRealizada = true;
      this.raS.listarPorUsuario(this.idUsuarioBuscar).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          
          if (data.length === 0) {
            this.mensaje = "Este usuario no tiene registros de alimentación.";
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

  // 5. FUNCIÓN AUXILIAR PARA EL HTML
  getNombreAlimento(id: number): string {
    // Si encontramos el ID en el mapa, devolvemos el nombre. Si no, devolvemos el ID o "Cargando..."
    return this.mapaAlimentos.get(id) || `ID: ${id}`;
  }
}