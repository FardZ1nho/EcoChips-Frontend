import { Component, OnInit } from "@angular/core";
import { ChartDataset, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card"; 


import { Usuarioservice } from "../../services/usuarioservice"; 

import { UsuarioCo2ImpactoDTO } from "../../models/UsuarioCo2ImpactoDTO";

@Component({
  selector: 'app-usuarioC2Impacto', 
 imports: [BaseChartDirective, MatIconModule, CommonModule, MatCardModule],
 standalone: true,
 templateUrl: './reporteUsuarioCo2Impacto.html',
 styleUrls: ['./reporteUsuarioCo2Impacto.css'],
 providers: [provideCharts(withDefaultRegisterables())],
})
export class UsuarioCo2Impacto implements OnInit { 
 hasData = false;


 barChartOptions: ChartOptions = { 
 responsive: true,

 indexAxis: 'y', 
 scales: { x: { beginAtZero: true }, y: {} },
 plugins: {
 legend: { display: false }, // La leyenda no es necesaria en un ranking
 title: { display: true, text: 'Ranking de Usuarios con Menor Impacto CO2' } // Título corregido
   }
 };
 barChartType: ChartType = 'bar';
 barChartLabels: string[] = [];
 barChartData: ChartDataset[] = [];


     constructor(private uS: Usuarioservice){} 

     ngOnInit(): void {

         this.uS.getUsuariosMenorImpacto().subscribe((data: UsuarioCo2ImpactoDTO[]) => {
        if (data && data.length > 0) {
                this.hasData = true;



               this.barChartLabels = data.map(item => item.nombre); 

               this.barChartData = [{
                   
                     data: data.map(item => item.co2Total),
                     label: 'Huella de Carbono (CO2 Total)',
                     backgroundColor: [
                       '#89e1a5ff', 
                      '#69d48bff',
                       'rgba(128, 250, 222, 1)',
                      '#ecf7acff',
                      '#f78cf9ff'
                     ]
                }]
            } else {
               this.hasData = false;
            }
      });
 }
}