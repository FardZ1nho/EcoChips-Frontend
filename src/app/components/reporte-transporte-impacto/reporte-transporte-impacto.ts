import { Component, OnInit } from "@angular/core";
import { ChartDataset, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { Transporteservice } from "../../services/transporteservice";

@Component({
    selector: 'app-reporte-transporte-impacto', 
    standalone: true,
    imports: [BaseChartDirective, MatIconModule, CommonModule],
    templateUrl: './reporte-transporte-impacto.html',
    styleUrls: ['./reporte-transporte-impacto.css'],
    providers: [provideCharts(withDefaultRegisterables())],
})
export class ReporteTransporteImpacto implements OnInit {
    hasData = false;
    barChartOptions: ChartOptions = { 
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        }
    };
    
    barChartType: ChartType = 'bar'; 
    barChartLegend = true;
    barChartLabels: string[] = [];
    barChartData: ChartDataset[] = [];

    constructor(private tService: Transporteservice){}

    ngOnInit(): void {
        this.tService.getTransporteImpacto().subscribe((data) => {
            if (data && data.length > 0) {
                this.hasData = true;
                this.barChartLabels = data.map(item => item.nombre);
                
                this.barChartData = [{
                    data: data.map(item => item.factorCo2),
                    label: 'Factor de CO2 (Impacto)',
                    backgroundColor: [
                        '#FF6384', 
                        '#36A2EB', 
                        '#FFCE56', 
                        '#4BC0C0', 
                        '#9966FF', 
                        '#FF9F40'
                    ],
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderWidth: 1
                }];
            } else {
                this.hasData = false;
            }
        });
    }
}