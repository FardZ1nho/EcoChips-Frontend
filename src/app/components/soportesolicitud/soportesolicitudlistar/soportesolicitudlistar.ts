import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; 
import { MatCardModule } from '@angular/material/card';

import { SoporteSolicitud } from '../../../models/SoporteSolicitud';
import { SoporteSolicitudService } from '../../../services/soportesolicitudservice'; 
@Component({
  selector: 'app-soportesolicitudlistar',
  standalone: true, // Componente independiente (sin módulo)
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './soportesolicitudlistar.html',
  styleUrls: ['./soportesolicitudlistar.css'],
})
export class SoporteSolicitudListar implements OnInit, AfterViewInit {
  
  dataSource: MatTableDataSource<SoporteSolicitud> = new MatTableDataSource();
  
  displayedColumns: string[] = [
    'idSoporteSolicitud', 
    'titulo', 
    'descripcion', 
    'fechahora', 
    'apartado', 
    'idUsuario',
    'acciones'
  ];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 15];

  constructor(
    private sS: SoporteSolicitudService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarLista();
    
    this.sS.getList().subscribe(data => {
      this.dataSource.data = data;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarLista() {
    this.sS.list().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: err => console.error('Error al listar solicitudes:', err)
    });
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta solicitud de soporte?')) {
      this.sS.delete(id).subscribe({
        next: () => {
          this.cargarLista(); 
        },
        error: err => console.error(err)
      });
    }
  }

  editar(id: number) {
    this.router.navigate(['/home/soportesolicitudes/editar', id]); 
  }

  nuevo() {
    this.router.navigate(['/home/soportesolicitudes/crear']);
  }
}