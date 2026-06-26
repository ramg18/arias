import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsutoTributarioComponent } from './asuto-tributario.component';

const routes: Routes = [
  { path: '', component: AsutoTributarioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsutoTributarioRoutingModule { }
