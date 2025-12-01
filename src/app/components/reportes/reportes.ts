import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Reporte {
  id: number;
  titulo: string;
  icono: string;
  descripcion: string;
  ruta: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class Reportes {
  reportes: Reporte[] = [
    { 
      id: 1, 
      titulo: 'Alimentación', 
      icono: '🍎', 
      descripcion: 'Ver reporte detallado de alimentación',
      ruta: '/home/reportes/promedio-co2-tipo' 
    },
    { 
      id: 2, 
      titulo: 'Transporte', 
      icono: '🚗', 
      descripcion: 'Ver reporte detallado de transporte',
      ruta: '/home/reportes/top5-contaminantes' 
    },
    { 
      id: 4, 
      titulo: 'Retos', 
      icono: '🏆', 
      descripcion: 'Ver reporte detallado de retos',
      ruta: '/home/reportes/populares' 
    },
    { 
      id: 5, 
      titulo: 'Participaciones', 
      icono: '👥', 
      descripcion: 'Ver reporte detallado de participaciones',
      ruta: '/home/reportes/top-usuarios' 
    },
    { 
      id: 6, 
      titulo: 'Recompensas', 
      icono: '🎁', 
      descripcion: 'Ver reporte detallado de recompensas',
      ruta: '/home/reportes/recompensas-populares' 
    },
    { 
      id: 7, 
      titulo: 'Usuarios', 
      icono: '👤', 
      descripcion: 'Ver reporte detallado de usuarios',
      ruta: '/home/reportes/usuarios' 
    },
    { 
      id: 8, 
      titulo: 'Soporte', 
      icono: '💬', 
      descripcion: 'Ver reporte detallado de soporte',
      ruta: '/home/reportes/soporte' 
    },
    { 
      id: 9, 
      titulo: 'Recomendacion', 
      icono: '💬', 
      descripcion: 'Ver reporte detallado de recomendacion',
      ruta: '/home/reportes/por-tipo' 
    }


  ];

  constructor(private router: Router) {}

  navegarReporte(ruta: string): void {
    console.log('Navegar a:', ruta);
    this.router.navigate([ruta]);
  }
}