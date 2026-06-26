import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevisoriaFiscalComponent } from './revisoria-fiscal.component';
import { RevisoriaFiscalRoutingModule } from './revisoria-fiscal-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RevisoriaFiscalComponent
  ],
  imports: [
    CommonModule,
    RevisoriaFiscalRoutingModule,
    SharedModule
  ]
})
export class RevisoriaFiscalModule { }
