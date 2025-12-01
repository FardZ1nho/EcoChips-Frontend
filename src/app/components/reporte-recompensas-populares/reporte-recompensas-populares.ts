import { Component, OnInit } from "@angular/core";
import { ChartDataset, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { UsuarioRecompensaService } from "../../services/usuariorecompensa";
import { RecompensaService } from "../../services/recompensa";

interface RecompensaCosto {
  tituloRecompensa: string;
  costoCanjes: number;
}

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
    loadingTablas = true;
    errorTablas = false;
    
    // Datos para las nuevas tablas
    recompensasCostosas: RecompensaCosto[] = [];
    recompensasBaratas: RecompensaCosto[] = [];
    
    // Configuración del gráfico (Dona) - MANTENIDO
    doughnutChartOptions: ChartOptions = { 
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'right',
            }
        }
    };
    
    doughnutChartType: ChartType = 'doughnut'; 
    doughnutChartLegend = true;
    doughnutChartLabels: string[] = [];
    doughnutChartData: ChartDataset[] = [];

    constructor(
        private urS: UsuarioRecompensaService,
        private recompensaService: RecompensaService
    ){}

    ngOnInit(): void {
        this.cargarGraficoPopularidad();
        this.cargarTablasCostos();
    }

    // MÉTODO ORIGINAL (mantenido)
    cargarGraficoPopularidad(): void {
        this.urS.obtenerRecompensasMasPopulares().subscribe((data) => {
            if (data && data.length > 0) {
                this.hasData = true;
                
                this.doughnutChartLabels = data.map(item => item.tituloRecompensa);
                
                this.doughnutChartData = [{
                    data: data.map(item => item.vecesCanjeada),
                    label: 'Total de Canjes',
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                        '#9966FF', '#FF9F40', '#C9CBCF'
                    ],
                    hoverOffset: 4
                }];
            } else {
                this.hasData = false;
            }
        });
    }

    // NUEVO MÉTODO para las tablas de costos
    cargarTablasCostos(): void {
        this.loadingTablas = true;
        
        // Cargar recompensas más costosas
        this.recompensaService.getRecompensasMasCostosas().subscribe({
            next: (data) => {
                this.recompensasCostosas = data;
                this.verificarCargaTablas();
            },
            error: (error) => {
                console.error('Error cargando recompensas costosas:', error);
                this.errorTablas = true;
                this.loadingTablas = false;
            }
        });

        // Cargar recompensas más baratas
        this.recompensaService.getRecompensasMasBaratas().subscribe({
            next: (data) => {
                this.recompensasBaratas = data;
                this.verificarCargaTablas();
            },
            error: (error) => {
                console.error('Error cargando recompensas baratas:', error);
                this.errorTablas = true;
                this.loadingTablas = false;
            }
        });
    }

    private verificarCargaTablas(): void {
        if (this.recompensasCostosas.length > 0 && this.recompensasBaratas.length > 0) {
            this.loadingTablas = false;
        }
    }
}