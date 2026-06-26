import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutasPipe } from '../pipes/rutas.pipe';
import { IndicadoresEconomicosComponent } from '../components/indicadores-economicos/indicadores-economicos.component';
import { IndicadoresService } from '../services/indicadores.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RutasPipe,
    IndicadoresEconomicosComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    RutasPipe,
    IndicadoresEconomicosComponent,
    TranslateModule
  ],
  providers: [
    IndicadoresService
  ]
})
export class SharedModule { }
