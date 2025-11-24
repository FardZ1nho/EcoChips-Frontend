import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ParticipacionReto } from '../../../models/ParticipacionReto';
import { ParticipacionRetoService } from '../../../services/participacionretoservice';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-participacionretolistar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatCardModule, MatGridListModule ],
  templateUrl: './participacionretolistar.html',
  styleUrls: ['./participacionretolistar.css'],
})
export class ParticipacionRetoListar implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<ParticipacionReto> = new MatTableDataSource();
  displayedColumns: string[] = ['id','usuario','reto','completado','acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 15]; // cards visibles por página

  constructor(private prS: ParticipacionRetoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarLista();
    this.prS.getList().subscribe(data => this.dataSource.data = data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarLista() {
    this.prS.list().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: err => console.error('Error al listar participaciones:', err)
    });
  }

  eliminar(id: number) {
    if(confirm('¿Seguro que deseas eliminar esta participación?')) {
      this.prS.delete(id).subscribe({
        next: () => {
          this.cargarLista();
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }

  editar(id: number) {
    this.router.navigate(['/home/participacionretos/editar', id]);
  }

  nuevo() {
    this.router.navigate(['/home/participacionretos/crear']);
  }

  /** Para paginado tipo cards */
  get particiacionretospaginados(): ParticipacionReto[] {
    if (!this.paginator) return this.dataSource.data;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    return this.dataSource.data.slice(start, start + this.paginator.pageSize);
  }
}