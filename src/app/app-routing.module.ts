import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CertificadosComponent } from './certificados/certificados.component';
import { ContactoComponent } from './contacto/contacto.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { BlogComponent } from './blog/blog.component';
import { EntradaComponent } from './entrada/entrada.component';
import { DetalleBlogComponent } from './detalle-blog/detalle-blog.component';

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
  {path: 'blog', component: BlogComponent},
  {path: 'entrada', component: EntradaComponent},
  {path: 'blog-details', component: DetalleBlogComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top', useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
