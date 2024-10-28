import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { ContactoComponent } from './contacto/contacto.component';
import { CertificadosComponent } from './certificados/certificados.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { BlogComponent } from './blog/blog.component';
import { EntradaComponent } from './entrada/entrada.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RutasPipe } from './pipes/rutas.pipe';
import { DetalleBlogComponent } from './detalle-blog/detalle-blog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ContactoComponent,
    CertificadosComponent,
    NosotrosComponent,
    BlogComponent,
    EntradaComponent,
    ServiciosComponent,
    RutasPipe,
    DetalleBlogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
