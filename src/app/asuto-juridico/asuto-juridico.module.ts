import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsutoJuridicoComponent } from './asuto-juridico.component';
import { AsutoJuridicoRoutingModule } from './asuto-juridico-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AsutoJuridicoComponent
  ],
  imports: [
    CommonModule,
    AsutoJuridicoRoutingModule,
    SharedModule
  ]
})
export class AsutoJuridicoModule { }
