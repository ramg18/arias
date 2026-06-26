import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliticasRoutingModule } from './politicas-routing.module';
import { PoliticasComponent } from './politicas.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PoliticasComponent
  ],
  imports: [
    CommonModule,
    PoliticasRoutingModule,
    SharedModule
  ]
})
export class PoliticasModule { }
