import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsutoJuridicoComponent } from './asuto-juridico.component';

const routes: Routes = [
  { path: '', component: AsutoJuridicoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsutoJuridicoRoutingModule { }
