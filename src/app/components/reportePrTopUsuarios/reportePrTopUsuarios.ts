import { Component, OnInit } from "@angular/core";
import { ChartDataset, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { TopUsuarioDTO } from "../../models/TopUsuarioDTO";
import { ParticipacionRetoService } from "../../services/participacionretoservice";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-reportePrTopUsuarios',
    standalone: true,
    imports: [BaseChartDirective, MatIconModule, CommonModule],
    templateUrl: './reportePrTopUsuarios.html',
    styleUrl: './reportePrTopUsuarios.css',
    providers: [provideCharts(withDefaultRegisterables())],
})
export class ReportePrTopUsuarios implements OnInit {
    hasData = false 
    
    barChartOptions: ChartOptions = {
        responsive: true,
    };

    barChartType: ChartType = 'bar';
    barChartLegend = true;
    barChartLabels: string[] = [];
    barChartData: ChartDataset[] = [];

    constructor(private psService: ParticipacionRetoService){}
    ngOnInit(): void {
        this.psService.getTopUsuarios().subscribe((data: TopUsuarioDTO[]) => {
            if(data.length > 0) {
                this.hasData = true;
                //Nombre de los usuarios
                this.barChartLabels = data.map((item) => item.nombreUsuario);
                //dataset
                this.barChartData = [
                    {
                        data: data.map((item) => item.retosCompletados),
                        label: 'Retos completados por usuario',
                        backgroundColor: [
                            '#75ddfcff',
                            '#aeacf7ff',
                            'rgba(252, 157, 117, 1)',
                            '#69d48bff',
                            '#ffdf6eff'
                        ],
                    },
                ];
            } else {
                this.hasData = false;
            }
        })
    }
}