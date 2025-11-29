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

import { Recomendacion } from '../../../models/Recomendacion';
import { UsuarioRecomendacionService } from '../../../services/usuariorecomendacion';


@Component({
  selector: 'app-listarporusuario',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatIconModule, MatCardModule, 
    CommonModule, FormsModule
  ],
  templateUrl: './listarporusuario.html',
  styleUrls: ['./listarporusuario.css']
})
export class ListarPorUsuarioComponent implements OnInit {
  // OJO: Aquí el dataSource es de Recomendacion (el objeto final), no de la asignación
  dataSource: MatTableDataSource<Recomendacion> = new MatTableDataSource();
  displayedColumns: string[] = ['titulo', 'tipo', 'descripcion'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  idUsuarioBuscar: number | null = null;
  mensaje: string = "Ingrese un ID para buscar";

  constructor(private urS: UsuarioRecomendacionService) {}

  ngOnInit(): void {}

  buscar() {
    if (this.idUsuarioBuscar) {
      this.urS.listarRecomendacionesPorUsuario(this.idUsuarioBuscar).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          
          if (data.length === 0) {
            this.mensaje = "Este usuario no tiene recomendaciones asignadas.";
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
}