import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsutoContableComponent } from './asuto-contable.component';
import { AsutoContableRoutingModule } from './asuto-contable-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AsutoContableComponent
  ],
  imports: [
    CommonModule,
    AsutoContableRoutingModule,
    SharedModule
  ]
})
export class AsutoContableModule { }
