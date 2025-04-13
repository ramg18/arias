import { Component, OnInit } from '@angular/core';
import { IndicadoresService } from '../../services/indicadores.service';

@Component({
  selector: 'app-indicadores-economicos',
  templateUrl: './indicadores-economicos.component.html',
  styleUrls: ['./indicadores-economicos.component.css']
})
export class IndicadoresEconomicosComponent implements OnInit {
  indicadores: any = null;

  constructor(private indicadoresService: IndicadoresService) { }

  ngOnInit(): void {
    this.indicadoresService.getIndicadores().subscribe({
      next: (data) => {
        console.log(data);

        this.indicadores = data;
      },
      error: (error) => {
        console.error('Error al obtener los indicadores', error);
      }
    });
  }
}
