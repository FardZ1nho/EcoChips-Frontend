import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Evento } from '../../../models/Evento';
import { Eventoservice } from '../../../services/eventoservice';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-eventolistar',
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
  templateUrl: './eventolistar.html',
  styleUrls: ['./eventolistar.css'],
})
export class EventoListar implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Evento> = new MatTableDataSource();
  displayedColumns: string[] = ['id','titulo','descripcion','fecha','hora','direccion','acciones'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 15]; // cards visibles por página

  constructor(private eS: Eventoservice, private router: Router) {}

  ngOnInit(): void {
    this.cargarLista();
    this.eS.getList().subscribe(data => this.dataSource.data = data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarLista() {
    this.eS.list().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: err => console.error('Error al listar eventos:', err)
    });
  }

  eliminar(id: number) {
    if(confirm('¿Seguro que deseas eliminar este evento?')) {
      this.eS.delete(id).subscribe({
        next: () => {
          alert('Evento eliminado correctamente');
          this.cargarLista();
        },
        error: err => {
          console.error(err);
          alert('Error al eliminar el evento');
        }
      });
    }
  }

  editar(id: number) {
    this.router.navigate(['/home/eventos/editar', id]);
  }

  nuevo() {
    this.router.navigate(['/home/eventos/crear']);
  }

  /** Para paginado tipo cards */
  get eventosPaginados(): Evento[] {
    if (!this.paginator) return this.dataSource.data;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    return this.dataSource.data.slice(start, start + this.paginator.pageSize);
  }
}