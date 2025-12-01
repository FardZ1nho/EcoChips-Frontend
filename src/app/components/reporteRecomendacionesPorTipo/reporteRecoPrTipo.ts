import { Component, OnInit } from "@angular/core";
import { ChartDataset, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { Recomendacionservice } from "../../services/recomendacionservice";
import { RecomendacionTipoCountDTO } from "../../models/RecomendacionTipoCountDTO";


@Component({
    selector: 'app-reporteRecoPrTipo',
    standalone: true,
    imports: [BaseChartDirective, MatIconModule, CommonModule],
    templateUrl: './reporteRecoPrTipo.html',
    styleUrl: './reporteRecoPrTipo.css',
    providers: [provideCharts(withDefaultRegisterables())],
})
export class ReporteRecoPrTipo implements OnInit {
    
    hasData = false 
    
    barChartOptions: ChartOptions = {
        responsive: true,
    };

    barChartType: ChartType = 'bar';
    barChartLegend = true;
    barChartLabels: string[] = [];
    barChartData: ChartDataset[] = [];

    constructor(private psService: Recomendacionservice){}

    ngOnInit(): void {
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
}