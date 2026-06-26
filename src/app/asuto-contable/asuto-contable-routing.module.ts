import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsutoContableComponent } from './asuto-contable.component';

const routes: Routes = [
  { path: '', component: AsutoContableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsutoContableRoutingModule { }
