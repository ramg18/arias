import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Servicios Contables, Fiscales y Jurídicos en Sincelejo | Arias & Asociados');
    this.metaService.updateTag({ name: 'description', content: 'Firma contable en Sincelejo con servicios de asesoría contable, revisoría fiscal, asesoría tributaria y jurídica para empresas en Sucre y Colombia.' });
    this.metaService.updateTag({ property: 'og:title', content: 'Servicios Contables, Fiscales y Jurídicos en Sincelejo | Arias & Asociados' });
    this.metaService.updateTag({ property: 'og:description', content: 'Firma contable en Sincelejo: asesoría contable, revisoría fiscal, tributaria y jurídica para empresas en Sucre.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://ariasyasociados.co/servicios' });
  }

  quienessomos = true;
  contable = false;
  tributario = false;
  revisoria = false;
  juridico = false;

mostrar(numero: any){
  switch (numero) {
    case 1:
      this.quienessomos = true;
      this.contable = false;
      this.tributario = false;
      this.revisoria = false;
      this.juridico = false;

      break;
    case 2:
      this.quienessomos = false;
      this.contable = true;
      this.tributario = false;
      this.revisoria = false;
      this.juridico = false;
      break;
    case 3:
      this.quienessomos = false;
      this.contable = false;
      this.tributario = false;
      this.revisoria = false;
      this.juridico = true;
      break;
    case 4:
      this.quienessomos = false;
      this.contable = false;
      this.tributario = true;
      this.revisoria = false;
      this.juridico = false;
      break;
    case 5:
      this.quienessomos = false;
      this.contable = false;
      this.tributario = false;
      this.revisoria = true;
      this.juridico = false;
      break;


  }
}

}
