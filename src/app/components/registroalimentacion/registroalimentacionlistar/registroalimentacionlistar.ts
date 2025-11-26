import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { RegistroAlimentacionService } from '../../../services/registroalimentacionservice';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-registroalimentacionlistar',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatCardModule
  ],
  templateUrl: './registroalimentacionlistar.html',
  styleUrl: './registroalimentacionlistar.css'
})
export class Registroalimentacionlistar implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'usuario', 'alimento', 'porciones', 'co2', 'fecha', 'acciones'];
  dataSource: any[] = [];

  // Estadísticas
  totalRegistros: number = 0;
  totalPorciones: number = 0;
  totalCO2: number = 0;

  constructor(
    private raS: RegistroAlimentacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.raS.list().subscribe(data => {
      this.dataSource = data;
      this.calcularEstadisticas();
    });
  }

  calcularEstadisticas(): void {
    this.totalRegistros = this.dataSource.length;
    this.totalPorciones = this.dataSource.reduce((sum, item) => sum + (item.porciones || 0), 0);
    this.totalCO2 = this.dataSource.reduce((sum, item) => sum + (item.co2Emitido || 0), 0);
  }

  editarRegistro(id: number): void {
    this.router.navigate(['/home/registrosalimentacion/editar', id]);
  }

  eliminarRegistro(id: number): void {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.raS.delete(id).subscribe(() => {
        this.raS.list().subscribe(data => {
          this.raS.setList(data);
          this.dataSource = data;
          this.calcularEstadisticas();
        });
      });
    }
  }

  nuevoRegistro(): void {
    this.router.navigate(['/home/registrosalimentacion/insertar']);
  }
}