import { Component, OnInit } from "@angular/core";
import { ChartDataset, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { UsuarioRecompensaService } from "../../services/usuariorecompensa";


@Component({
    selector: 'app-reporte-recompensas-populares',
    standalone: true,
    imports: [BaseChartDirective, MatIconModule, CommonModule],
    templateUrl: './reporte-recompensas-populares.html',
    styleUrls: ['./reporte-recompensas-populares.css'],
    providers: [provideCharts(withDefaultRegisterables())],
})
export class ReporteRecompensasPopulares implements OnInit {
    hasData = false;
    
    // Configuración del gráfico (Dona)
    doughnutChartOptions: ChartOptions = { 
        responsive: true,
        maintainAspectRatio: false, // Importante para que se adapte al contenedor
        plugins: {
            legend: {
                display: true,
                position: 'right', // Leyenda a la derecha
            }
        }
    };
    
    doughnutChartType: ChartType = 'doughnut'; 
    doughnutChartLegend = true;
    doughnutChartLabels: string[] = [];
    doughnutChartData: ChartDataset[] = [];

    constructor(private urS: UsuarioRecompensaService){}

    ngOnInit(): void {
        this.urS.obtenerRecompensasMasPopulares().subscribe((data) => {
            if (data && data.length > 0) {
                this.hasData = true;
                
                // Mapeo EXACTO según tu modelo RecompensaPopularDTO
                this.doughnutChartLabels = data.map(item => item.tituloRecompensa);
                
                this.doughnutChartData = [{
                    data: data.map(item => item.vecesCanjeada),
                    label: 'Total de Canjes',
                    backgroundColor: [
                        '#FF6384', // Rojo suave
                        '#36A2EB', // Azul
                        '#FFCE56', // Amarillo
                        '#4BC0C0', // Verde agua
                        '#9966FF', // Violeta
                        '#FF9F40', // Naranja
                        '#C9CBCF'  // Gris
                    ],
                    hoverOffset: 4
                }];
            } else {
                this.hasData = false;
            }
        });
    }
}