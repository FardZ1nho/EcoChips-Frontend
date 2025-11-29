import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import { UsuarioRecomendacion } from '../../../models/UsuarioRecomendacion';
import { UsuarioRecomendacionService } from '../../../services/usuariorecomendacion';

@Component({
  selector: 'app-usuariorecomendacionlistar',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    MatIconModule, 
    MatButtonModule, 
    RouterLink, 
    MatCardModule, 
    CommonModule
  ],
  templateUrl: './usuariorecomendacionlistar.html',
  styleUrls: ['./usuariorecomendacionlistar.css']
})
export class UsuarioRecomendacionListar implements OnInit {
  dataSource: MatTableDataSource<UsuarioRecomendacion> = new MatTableDataSource();
  
  displayedColumns: string[] = ['id', 'idUsuario', 'idRecomendacion', 'fecha', 'acciones'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private urS: UsuarioRecomendacionService, private router: Router) {}

  ngOnInit(): void {
    this.cargarLista();
    this.urS.getList().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  cargarLista() {
    this.urS.list().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    if(confirm('¿Deseas eliminar esta asignación?')){
        this.urS.delete(id).subscribe(() => {
          this.cargarLista();
        });
    }
  }
  
  editar(id: number){
    this.router.navigate(['/home/usuariorecomendacion/editar', id]);
  }
}