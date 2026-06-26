import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CertificadosComponent } from './certificados/certificados.component';
import { ContactoComponent } from './contacto/contacto.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { BlogComponent } from './blog/blog.component';
import { EntradaComponent } from './entrada/entrada.component';
import { DetalleBlogComponent } from './detalle-blog/detalle-blog.component';
import { AsutoContableComponent } from './asuto-contable/asuto-contable.component';
import { AsutoJuridicoComponent } from './asuto-juridico/asuto-juridico.component';
import { AsutoTributarioComponent } from './asuto-tributario/asuto-tributario.component';
import { RevisoriaFiscalComponent } from './revisoria-fiscal/revisoria-fiscal.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path: 'home', component: HomeComponent},
  {path: 'certificados', component: CertificadosComponent},
  {path: 'contacto', component: ContactoComponent},
  {path: 'servicios', component: ServiciosComponent},
  {path: 'servicios-contables', component: AsutoContableComponent},
  {path: 'servicios-juridicos', component: AsutoJuridicoComponent},
  {path: 'servicios-tributarios', component: AsutoTributarioComponent},
  {path: 'revisoria-fiscal', component: RevisoriaFiscalComponent},
  {path: 'blog', component: BlogComponent},
  {path: 'entrada', component: EntradaComponent},
  {path: 'blog-details/:id', component: DetalleBlogComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
