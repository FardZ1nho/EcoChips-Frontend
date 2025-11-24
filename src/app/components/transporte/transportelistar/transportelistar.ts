import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; 
import { MatCardModule } from '@angular/material/card';

import { Transporte } from '../../../models/Transporte';
import { Transporteservice } from '../../../services/transporteservice';


@Component({
  selector: 'app-transportelistar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './transportelistar.html',
  styleUrls: ['./transportelistar.css'],
})
export class Transportelistar implements OnInit, AfterViewInit {
  
  dataSource: MatTableDataSource<Transporte> = new MatTableDataSource();
  
  // CORREGIDO: Solo las columnas que existen en tu modelo
  displayedColumns: string[] = ['idTransporte', 'nombre', 'factorCo2', 'acciones'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 15];

  constructor(private tS: Transporteservice, private router: Router) {}

  ngOnInit(): void {
    this.cargarLista();
    this.tS.getList().subscribe(data => {
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
    this.tS.list().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: err => console.error('Error al listar transportes:', err)
    });
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar este transporte?')) {
      this.tS.delete(id).subscribe({
        next: () => {
          this.cargarLista();
        },
        error: err => console.error(err)
      });
    }
  }

  editar(id: number) {
    // Asegúrate que esta ruta exista en tu app.routes.ts dentro del children de Home
    this.router.navigate(['/home/transporte/actualizar', id]); 
  }

  nuevo() {
    this.router.navigate(['/home/transporte/registrar']);
  }
}