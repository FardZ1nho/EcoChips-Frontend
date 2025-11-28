import { Component, OnInit } from "@angular/core";
import { ChartDataset, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { AlimentoService } from "../../services/alimento";

@Component({
    selector: 'app-reporte-alimento-co2',
    standalone: true,
    imports: [BaseChartDirective, MatIconModule, CommonModule],
    templateUrl: './reporte-alimento-co2.html',
    styleUrls: ['./reporte-alimento-co2.css'],
    providers: [provideCharts(withDefaultRegisterables())],
})
export class ReporteAlimentoCO2 implements OnInit {
    hasData = false;
    
    // Configuración del gráfico
    doughnutChartOptions: ChartOptions = { 
        responsive: true,
        maintainAspectRatio: false, // Importante para que se ajuste al contenedor
        plugins: {
            legend: {
                display: true,
                position: 'right', // Leyenda a la derecha queda mejor en donas
            }
        }
    };
    
    // TIPO DE GRÁFICO: DOUGHNUT (Dona)
    doughnutChartType: ChartType = 'doughnut'; 
    
    doughnutChartLegend = true;
    doughnutChartLabels: string[] = [];
    doughnutChartData: ChartDataset[] = [];

    constructor(private aService: AlimentoService){}

    ngOnInit(): void {
        this.aService.getPromedioCO2PorTipo().subscribe((data) => {
            if (data && data.length > 0) {
                this.hasData = true;
                
                this.doughnutChartLabels = data.map(item => item.tipo);
                
                this.doughnutChartData = [{
                    data: data.map(item => item.promedioCO2),
                    label: 'Promedio CO2',
                    backgroundColor: [
                        '#FF6384', // Rojo
                        '#36A2EB', // Azul
                        '#FFCE56', // Amarillo
                        '#4BC0C0', // Verde
                        '#9966FF', // Violeta
                        '#FF9F40', // Naranja
                        '#E7E9ED'  // Gris
                    ],
                    hoverOffset: 4
                }];
            } else {
                this.hasData = false;
            }
        });
    }
}