import { Component, OnInit } from "@angular/core";
import { ChartDataset, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { Recomendacionservice } from "../../services/recomendacionservice";
import { RecomendacionTipoCountDTO } from "../../models/RecomendacionTipoCountDTO";
import { UsuarioRecomendacionService } from "../../services/usuariorecomendacion";

@Component({
    selector: 'app-reporteRecoPrTipo',
    standalone: true,
    imports: [BaseChartDirective, MatIconModule, CommonModule],
    templateUrl: './reporteRecoPrTipo.html',
    styleUrl: './reporteRecoPrTipo.css',
    providers: [provideCharts(withDefaultRegisterables())],
})
export class ReporteRecoPrTipo implements OnInit {
    
    hasData = false;
    hasDataTipos = false;
    loadingTipos = true;
    
    // Datos para el nuevo gráfico de tipos más asignados
    tiposRecomendacion: any[] = [];
    totalAsignaciones: number = 0;

    // Gráfico de barras existente
    barChartOptions: ChartOptions = {
        responsive: true,
    };

    barChartType: ChartType = 'bar';
    barChartLegend = true;
    barChartLabels: string[] = [];
    barChartData: ChartDataset[] = [];

    // Colores para el gráfico de pie
    colors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    constructor(
        private psService: Recomendacionservice,
        private usuarioRecomendacionService: UsuarioRecomendacionService
    ){}

    ngOnInit(): void {
        this.cargarRecomendacionesPorTipo();
        this.cargarTiposRecomendacionesMasAsignados();
    }

    // Método existente - Gráfico de barras
    cargarRecomendacionesPorTipo(): void {
        this.psService.getRecomendacionesPorTipo().subscribe((data: RecomendacionTipoCountDTO[]) => {
            if(data.length > 0) {
                this.hasData = true;
                this.barChartLabels = data.map((item) => item.tipo);
                this.barChartData = [
                    {
                        data: data.map((item) => item.cantidad),
                        label: 'Total de recomendaciones',
                        backgroundColor: [
                            '#75ddfcff',
                            '#aeacf7ff',
                            'rgba(252, 157, 117, 1)',
                            '#69d48bff',
                            '#ffdf6eff'
                        ],
                        hoverBackgroundColor: '#3F51B5'
                    },
                ];
            } else {
                this.hasData = false;
            }
        })
    }

    // NUEVO MÉTODO - Gráfico de tipos más asignados
    cargarTiposRecomendacionesMasAsignados(): void {
        this.loadingTipos = true;
        
        // Primero necesitamos agregar el método al servicio
        this.usuarioRecomendacionService.getTiposRecomendacionesMasAsignados().subscribe({
            next: (data: any) => {
                if (data && data.length > 0) {
                    this.hasDataTipos = true;
                    this.tiposRecomendacion = data;
                    this.totalAsignaciones = this.tiposRecomendacion.reduce((total, item) => total + item.vecesAsignado, 0);
                } else {
                    this.hasDataTipos = false;
                }
                this.loadingTipos = false;
            },
            error: (error) => {
                console.error('Error cargando tipos de recomendaciones:', error);
                this.hasDataTipos = false;
                this.loadingTipos = false;
            }
        });
    }

    // Métodos para el gráfico de pie
    getPorcentaje(cantidad: number): number {
        return (cantidad / this.totalAsignaciones) * 100;
    }

    getColor(index: number): string {
        return this.colors[index % this.colors.length];
    }

    formatearTipo(tipo: string): string {
        if (!tipo) return 'Sin tipo';
        return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
    }

    // Método para el gráfico de pie
    getPieBackground(): string {
        if (this.tiposRecomendacion.length === 0) return '#f0f0f0';
        
        let conicString = '';
        let currentPercent = 0;
        
        this.tiposRecomendacion.forEach((item, index) => {
            const porcentaje = this.getPorcentaje(item.vecesAsignado);
            const start = currentPercent;
            const end = currentPercent + porcentaje;
            
            conicString += `${this.getColor(index)} ${start}% ${end}%, `;
            currentPercent = end;
        });
        
        return `conic-gradient(${conicString.slice(0, -2)})`;
    }
}