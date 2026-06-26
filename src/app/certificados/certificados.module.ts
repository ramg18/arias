import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificadosComponent } from './certificados.component';
import { CertificadosRoutingModule } from './certificados-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CertificadosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CertificadosRoutingModule,
    SharedModule
  ]
})
export class CertificadosModule { }
