import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import { Recompensa } from '../../../models/Recompensa';
import { RecompensaService } from '../../../services/recompensa';


@Component({
  selector: 'app-recompensalistar',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink, MatCardModule, CommonModule],
  templateUrl: './recompensalistar.html',
  styleUrls: ['./recompensalistar.css']
})
export class Recompensalistar implements OnInit {
  dataSource: MatTableDataSource<Recompensa> = new MatTableDataSource();
  
  displayedColumns: string[] = ['id', 'titulo', 'descripcion', 'costo', 'acciones'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rS: RecompensaService, private router: Router) {}

  ngOnInit(): void {
    this.cargarLista();
    this.rS.getList().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  cargarLista() {
    this.rS.list().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    if(confirm('¿Deseas eliminar esta recompensa?')){
        this.rS.delete(id).subscribe(() => {
          this.cargarLista();
        });
    }
  }
  
  editar(id: number){
    this.router.navigate(['/home/recompensas/editar', id]);
  }
}