
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Recomendacion } from '../../../models/Recomendacion';
import { Recomendacionservice } from '../../../services/recomendacionservice';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-recomendacionlistar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatCardModule, MatGridListModule],
  templateUrl: './recomendacionlistar.html',
  styleUrls: ['./recomendacionlistar.css'],
})
export class RecomendacionListar implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Recomendacion> = new MatTableDataSource();
  displayedColumns: string[] = ['idRecomendacion', 'titulo', 'descripcion', 'tipo', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 15];

  constructor(private rS: Recomendacionservice, private router: Router) {}

  ngOnInit(): void {
    this.cargarLista();
    this.rS.getList().subscribe(data => this.dataSource.data = data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarLista() {
    this.rS.list().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: err => console.error('Error al listar recomendaciones:', err)
    });
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta recomendación?')) {
      this.rS.delete(id).subscribe({
        next: () => {
          this.cargarLista();
        },
        error: err => console.error('Error al eliminar recomendación:', err)
      });
    }
  }

  editar(id: number) {
    this.router.navigate(['/home/recomendaciones/editar', id]);
  }

  nuevo() {
    this.router.navigate(['/home/recomendaciones/crear']);
  }

  /** Paginación tipo cards */
  get recomendacionesPaginadas(): Recomendacion[] {
    if (!this.paginator) return this.dataSource.data;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    return this.dataSource.data.slice(start, start + this.paginator.pageSize);
  }
}
