import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { RegistroTransporte } from '../../../models/RegistroTransporte';

import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RegistroTransporteService } from '../../../services/registrotransporteservice';

@Component({
  selector: 'app-registrotransportelistar',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink, MatCardModule, CommonModule],
  templateUrl: './registrotransportelistar.html',
  styleUrls: ['./registrotransportelistar.css']
})
export class RegistroTransporteListar implements OnInit {
  dataSource: MatTableDataSource<RegistroTransporte> = new MatTableDataSource();
  
  // Nombres de columnas para el HTML
  displayedColumns: string[] = ['id', 'usuario', 'transporte', 'distancia', 'co2', 'fecha', 'acciones'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rTs: RegistroTransporteService, private router: Router) {}

  ngOnInit(): void {
    this.rTs.list().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
    this.rTs.getList().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    if(confirm('¿Eliminar registro?')){
        this.rTs.delete(id).subscribe(() => {
        this.rTs.list().subscribe(data => this.rTs.setList(data));
        });
    }
  }
  
  // Asegúrate de crear esta ruta en app.routes.ts
  editar(id:number){
    this.router.navigate(['/home/registrostransporte/editar', id]);
  }
}
