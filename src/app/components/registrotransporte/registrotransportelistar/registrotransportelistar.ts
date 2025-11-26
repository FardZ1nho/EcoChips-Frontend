import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RegistroTransporte } from '../../../models/RegistroTransporte';
import { RegistroTransporteService } from '../../../services/registrotransporteservice';

@Component({
  selector: 'app-registrotransportelistar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './registrotransportelistar.html',
  styleUrls: ['./registrotransportelistar.css']
})
export class RegistroTransporteListar implements OnInit {

  dataSource: MatTableDataSource<RegistroTransporte> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'usuario', 'transporte', 'distancia', 'co2', 'fecha', 'acciones'];
  
  // Variables para estadísticas
  totalRegistros: number = 0;
  totalDistancia: number = 0;
  totalCO2: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rS: RegistroTransporteService, private router: Router) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.rS.list().subscribe((data: RegistroTransporte[]) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      
      // Calcular estadísticas
      this.calcularEstadisticas(data);
    });
  }

  calcularEstadisticas(data: RegistroTransporte[]) {
    this.totalRegistros = data.length;
    this.totalDistancia = data.reduce((sum, item) => sum + item.distanciaKm, 0);
    this.totalCO2 = data.reduce((sum, item) => sum + item.co2Emitido, 0);
  }

  eliminar(id: number) {
    if(confirm('¿Seguro que deseas eliminar este registro?')) {
      this.rS.delete(id).subscribe({
        next: () => {
          alert('Registro eliminado correctamente');
          this.cargarDatos(); // Recargar datos para actualizar estadísticas
        },
        error: err => {
          console.error(err);
          alert('Error al eliminar el registro');
        }
      });
    }
  }

  editar(id: number) {
    this.router.navigate(['/home/registrostransporte/editar', id]);
  }

  nuevo() {
    this.router.navigate(['/home/registrostransporte/insertar']);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}