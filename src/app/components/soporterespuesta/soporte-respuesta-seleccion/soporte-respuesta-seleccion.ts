import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SoporteSolicitud } from '../../../models/SoporteSolicitud';
import { SoporteSolicitudService } from '../../../services/soportesolicitudservice';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-soporterespuesta-seleccion',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './soporte-respuesta-seleccion.html',
  styleUrls: ['./soporte-respuesta-seleccion.css']
})
export class SoporteRespuestaSeleccionComponent implements OnInit {
  dataSource: MatTableDataSource<SoporteSolicitud> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'titulo', 'usuario', 'fecha', 'acciones'];

  constructor(private sSolicitudService: SoporteSolicitudService) {}

  ngOnInit(): void {
    // Cargamos TODAS las solicitudes para ver cuál responder
    this.sSolicitudService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
}