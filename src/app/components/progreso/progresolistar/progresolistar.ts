import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { Progresoservice } from '../../../services/progresoservice';
import { Progreso } from '../../../models/Progreso';

@Component({
  selector: 'app-progresolistar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatCardModule,
    MatGridListModule
  ],
  templateUrl: './progresolistar.html',
  styleUrls: ['./progresolistar.css']
})
export class ProgresoListar implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Progreso> = new MatTableDataSource();
  displayedColumns: string[] = ['idProgreso', 'idUsuario', 'puntos', 'estado', 'fecha', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 15];

  constructor(private pS: Progresoservice, private router: Router) {}

  ngOnInit(): void {
    this.cargarLista();
    this.pS.getList().subscribe(data => this.dataSource.data = data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarLista() {
    this.pS.list().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: err => console.error('Error al listar progresos:', err)
    });
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar este progreso?')) {
      this.pS.delete(id).subscribe({
        next: () => this.cargarLista(),
        error: err => console.error('Error al eliminar progreso:', err)
      });
    }
  }

  editar(id: number) {
    this.router.navigate(['/home/progreso/editar', id]);
  }

  nuevo() {
    this.router.navigate(['/home/progreso/crear']);
  }

  /** Paginación modo cards */
  get progresosPaginados(): Progreso[] {
    if (!this.paginator) return this.dataSource.data;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    return this.dataSource.data.slice(start, start + this.paginator.pageSize);
  }
}
