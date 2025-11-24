import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Reto } from '../../../models/Reto';
import { Retoservice } from '../../../services/retoservice';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-retolistar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatCardModule,
    MatGridListModule
  ],
  templateUrl: './retolistar.html',
  styleUrls: ['./retolistar.css'],
})
export class Retolistar implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Reto> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 15]; // cards visibles por página
  constructor(private rS: Retoservice, private router: Router) {}

  ngOnInit(): void {
    this.cargarLista();
    this.rS.getList().subscribe(data => {
      this.dataSource.data = data;
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
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
      error: err => console.error('Error al listar retos:', err)
    });
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar este reto?')) {
      this.rS.delete(id).subscribe({
        next: () => {
          alert('Reto eliminado correctamente');
          this.cargarLista();
        },
        error: err => console.error(err)
      });
    }
  }

  editar(id: number) {
    this.router.navigate(['/home/retos/editar', id]);
  }

  nuevo() {
    this.router.navigate(['/home/retos/crear']);
  }

  formatoFecha(fecha: Date | string): string {
    const d = new Date(fecha);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
  }

  /** Para paginado tipo cards */
  get retosPaginados(): Reto[] {
    if (!this.paginator) return this.dataSource.data;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    return this.dataSource.data.slice(start, start + this.paginator.pageSize);
  }
}