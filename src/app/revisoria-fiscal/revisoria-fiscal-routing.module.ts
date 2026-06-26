import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevisoriaFiscalComponent } from './revisoria-fiscal.component';

const routes: Routes = [
  { path: '', component: RevisoriaFiscalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevisoriaFiscalRoutingModule { }
