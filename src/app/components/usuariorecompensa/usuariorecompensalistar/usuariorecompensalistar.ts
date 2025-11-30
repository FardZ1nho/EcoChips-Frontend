import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import { UsuarioRecompensa } from '../../../models/UsuarioRecompensa';
import { UsuarioRecompensaService } from '../../../services/usuariorecompensa';


@Component({
  selector: 'app-usuariorecompensalistar',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatIconModule, 
    MatButtonModule, RouterLink, MatCardModule, CommonModule
  ],
  templateUrl: './usuariorecompensalistar.html',
  styleUrls: ['./usuariorecompensalistar.css']
})
export class UsuarioRecompensaListar implements OnInit {
  dataSource: MatTableDataSource<UsuarioRecompensa> = new MatTableDataSource();
  
  // Columnas a mostrar (Coinciden con tu modelo Java)
  displayedColumns: string[] = ['id', 'idUsuario', 'idRecompensa', 'fecha', 'acciones'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private urS: UsuarioRecompensaService, private router: Router) {}

  ngOnInit(): void {
    this.cargarLista();
    
    // Suscripción para actualizar la tabla si hay cambios
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
    if(confirm('¿Deseas eliminar este canje?')){
        this.urS.delete(id).subscribe(() => {
          // Recargar lista después de eliminar
          this.urS.list().subscribe(data => this.urS.setList(data));
        });
    }
  }
  
  editar(id: number){
    this.router.navigate(['/home/usuariorecompensa/editar', id]);
  }
}