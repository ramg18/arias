import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ClientesComponent } from './clientes.component';
import { LoginClientesComponent } from './components/login-clientes/login-clientes.component';
import { FileDropzoneComponent } from './components/file-dropzone/file-dropzone.component';
import { TabFacturasComponent } from './components/tab-facturas/tab-facturas.component';
import { TabComprobanteComponent } from './components/tab-comprobante/tab-comprobante.component';
import { TabNominaComponent } from './components/tab-nomina/tab-nomina.component';

@NgModule({
  declarations: [
    ClientesComponent,
    LoginClientesComponent,
    FileDropzoneComponent,
    TabFacturasComponent,
    TabComprobanteComponent,
    TabNominaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: ClientesComponent }])
  ]
})
export class ClientesModule {}
