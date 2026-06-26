import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsutoTributarioComponent } from './asuto-tributario.component';
import { AsutoTributarioRoutingModule } from './asuto-tributario-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AsutoTributarioComponent
  ],
  imports: [
    CommonModule,
    AsutoTributarioRoutingModule,
    SharedModule
  ]
})
export class AsutoTributarioModule { }
