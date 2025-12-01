import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Usuarioservice } from "../../services/usuarioservice";

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-reporte-distribucion-genero',
    standalone: true,
    imports: [
      CommonModule,
      MatCardModule,
      MatProgressSpinnerModule
    ],
    templateUrl: './reporte-distribucion-genero.html',
    styleUrls: ['./reporte-distribucion-genero.css']
})
export class ReporteDistribucionGenero implements OnInit {
    loading = true;
    datosGenero: any[] = [];
    totalParticipantes: number = 0;

    // Colores para el gráfico
    colors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'];

    constructor(private userService: Usuarioservice){}

    ngOnInit(): void {
        this.cargarDatosGenero();
    }

    cargarDatosGenero(): void {
        this.loading = true;
        
        this.userService.reporteGenero().subscribe({
            next: (data: any) => {
                if (data && data.length > 0) {
                    this.datosGenero = data;
                    this.totalParticipantes = this.datosGenero.reduce((total, item) => total + item.cantidadParticipantes, 0);
                }
                this.loading = false;
            },
            error: (error) => {
                console.error('Error:', error);
                this.loading = false;
            }
        });
    }

    formatearGenero(genero: string): string {
        const generos: { [key: string]: string } = {
            'Masculino': 'Masculino',
            'Femenino': 'Femenino', 
            'Otro': 'Otro',
            'Prefiero no decir': 'Prefiero no decir'
        };
        return generos[genero] || genero || 'No especificado';
    }

    getPorcentaje(cantidad: number): number {
        return (cantidad / this.totalParticipantes) * 100;
    }

    getColor(index: number): string {
        return this.colors[index % this.colors.length];
    }

    // Método SIMPLE para el background del pie chart
    getPieBackground(): string {
        if (this.datosGenero.length === 0) return '#f0f0f0';
        
        let conicString = '';
        let currentPercent = 0;
        
        this.datosGenero.forEach((item, index) => {
            const porcentaje = this.getPorcentaje(item.cantidadParticipantes);
            const start = currentPercent;
            const end = currentPercent + porcentaje;
            
            conicString += `${this.getColor(index)} ${start}% ${end}%, `;
            currentPercent = end;
        });
        
        // Remover la última coma y espacio
        conicString = conicString.slice(0, -2);
        
        return `conic-gradient(${conicString})`;
    }
}