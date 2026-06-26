import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactoComponent } from './contacto.component';
import { ContactoRoutingModule } from './contacto-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ContactoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactoRoutingModule,
    SharedModule
  ]
})
export class ContactoModule { }
