import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RegistroEvento } from '../../../models/RegistroEvento';
import { Registroeventoservice } from '../../../services/registroeventoservice';

@Component({
  selector: 'app-registroeventolistar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  templateUrl: './registroeventolistar.html',
  styleUrls: ['./registroeventolistar.css']
})
export class RegistroEventoListar implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<RegistroEvento> = new MatTableDataSource();
  pageSizeOptions: number[] = [2, 4, 8];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private reS: Registroeventoservice, private router: Router) {}
  ngOnInit(): void {
    this.cargarLista();
    this.reS.getList().subscribe(data => this.dataSource.data = data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarLista() {
    this.reS.list().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: err => console.error('Error al listar registros:', err)
    });
  }

  eliminar(id: number) {
    if(confirm('¿Seguro que deseas eliminar este registro?')) {
      this.reS.delete(id).subscribe({
        next: () => {
          alert('Registro eliminado correctamente');
          this.cargarLista();
        },
        error: err => {
          console.error(err);
          alert('Error al eliminar el registro');
        }
      });
    }
  }

  editar(id: number) {
    this.router.navigate(['/home/registroeventos/editar', id]);
  }

  /** Para paginado tipo cards */
  get registrosPaginados(): RegistroEvento[] {
    if (!this.paginator) return this.dataSource.data;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    return this.dataSource.data.slice(start, start + this.paginator.pageSize);
  }
}
