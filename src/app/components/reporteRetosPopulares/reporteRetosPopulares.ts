import { Component, OnInit } from "@angular/core";
import { ChartDataset, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { Retoservice } from "../../services/retoservice";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-reporteRetosPopulares',
    imports: [BaseChartDirective, MatIconModule, CommonModule],
    standalone: true,
    templateUrl: './reporteRetosPopulares.html',
    styleUrls: ['./reporteRetosPopulares.css'],
    providers: [provideCharts(withDefaultRegisterables())],
})
export class ReporteRetosPopulares implements OnInit {
    hasData = false;
    
    barChartOptions: ChartOptions = { responsive: true };
    barChartType: ChartType = 'doughnut';
    barChartLegend = true;
    barChartLabels: string[] = [];
    barChartData: ChartDataset[] = [];

    constructor(private rtoService: Retoservice){}

    ngOnInit(): void {
        this.rtoService.getRetosPopulares().subscribe((data) => {
            if (data.length > 0) {
                this.hasData = true;
                this.barChartLabels = data.map(item => item.titulo);
                this.barChartData = [{
                    data: data.map(item => item.cantidadParticipantes),
                    label: 'Cantidad de participantes',
                    backgroundColor: [
                        '#f78cf9ff',
                        '#ecf7acff',
                        'rgba(128, 250, 222, 1)',
                        '#89e1a5ff'                
                    ]
                }]
            } else {
                this.hasData = false;
            }
        });
    }
}