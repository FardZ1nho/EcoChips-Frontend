import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import { Alimento } from '../../../models/Alimento';
import { AlimentoService } from '../../../services/alimento';


@Component({
  selector: 'app-alimentolistar',
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
  templateUrl: './alimentolistar.html',
  styleUrls: ['./alimentolistar.css']
})
export class Alimentolistar implements OnInit {
  dataSource: MatTableDataSource<Alimento> = new MatTableDataSource();
  
  // Columnas que se verán en la tabla
  displayedColumns: string[] = ['id', 'nombre', 'tipo', 'co2', 'acciones'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private aS: AlimentoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarLista();
    
    // Suscribirse a los cambios
    this.aS.getList().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  cargarLista() {
    this.aS.list().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    if(confirm('¿Estás seguro de eliminar este alimento?')){
        this.aS.delete(id).subscribe(() => {
          this.cargarLista();
        });
    }
  }
  
  editar(id: number){
    this.router.navigate(['/home/alimentos/editar', id]);
  }
}