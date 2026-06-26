import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { BlogComponent } from './blog/blog.component';
import { EntradaComponent } from './entrada/entrada.component';
import { DetalleBlogComponent } from './detalle-blog/detalle-blog.component';
import { PublicarComponent } from './components/publicar/publicar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path: 'certificados', loadChildren: () => import('./certificados/certificados.module').then(m => m.CertificadosModule)},
  {path: 'contacto', loadChildren: () => import('./contacto/contacto.module').then(m => m.ContactoModule)},
  {path: 'servicios', loadChildren: () => import('./servicios/servicios.module').then(m => m.ServiciosModule)},
  {path: 'servicios-contables', loadChildren: () => import('./asuto-contable/asuto-contable.module').then(m => m.AsutoContableModule)},
  {path: 'servicios-juridicos', loadChildren: () => import('./asuto-juridico/asuto-juridico.module').then(m => m.AsutoJuridicoModule)},
  {path: 'servicios-tributarios', loadChildren: () => import('./asuto-tributario/asuto-tributario.module').then(m => m.AsutoTributarioModule)},
  {path: 'revisoria-fiscal', loadChildren: () => import('./revisoria-fiscal/revisoria-fiscal.module').then(m => m.RevisoriaFiscalModule)},
  {path: 'politicas-de-privacidad', loadChildren: () => import('./politicas/politicas.module').then(m => m.PoliticasModule)},
  {path: 'blog', component: BlogComponent},
  {path: 'entrada', component: EntradaComponent},
  {path: 'blog-details/:id', component: DetalleBlogComponent},
  {path: 'admin/publicar', component: PublicarComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
