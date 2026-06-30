import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-asuto-tributario',
  templateUrl: './asuto-tributario.component.html',
  styleUrls: ['./asuto-tributario.component.css']
})
export class AsutoTributarioComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Asesoría Tributaria en Sincelejo | Declaración de Renta | Arias & Asociados');
    this.metaService.updateTag({ name: 'description', content: 'Asesoría tributaria en Sincelejo: declaración de renta, optimización fiscal y cumplimiento DIAN para empresas y personas naturales en Sucre, Colombia.' });
    this.metaService.updateTag({ property: 'og:title', content: 'Asesoría Tributaria en Sincelejo | Declaración de Renta | Arias & Asociados' });
    this.metaService.updateTag({ property: 'og:description', content: 'Asesoría tributaria en Sincelejo. Declaración de renta, optimización fiscal y cumplimiento DIAN para empresas y personas naturales.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://ariasyasociados.co/servicios-tributarios' });
  }

    como = true;
    cumplimiento = false;
    elaboracion = false;
    optimizacion = false;
    analisis = false;
    gestion = false;

    mostrar(numero: any){
    switch (numero) {
      case 1:
        this.como = true;
        this.cumplimiento = false;
        this.elaboracion = false;
        this.optimizacion = false;
        this.analisis = false;
        this.gestion = false;

        break;
      case 2:
        this.como = false;
        this.cumplimiento = true;
        this.elaboracion = false;
        this.optimizacion = false;
        this.analisis = false;
        this.gestion = false;
        break;
      case 3:
        this.como = false;
        this.cumplimiento = false;
        this.elaboracion = true;
        this.optimizacion = false;
        this.analisis = false;
        this.gestion = false;
        break;
      case 4:
        this.como = false;
        this.cumplimiento = false;
        this.elaboracion = false;
        this.optimizacion = true;
        this.analisis = false;
        this.gestion = false;
        break;
      case 5:
        this.como = false;
        this.cumplimiento = false;
        this.elaboracion = false;
        this.optimizacion = false;
        this.analisis = true;
        this.gestion = false;
        break;
      case 6:
        this.como = false;
        this.cumplimiento = false;
        this.elaboracion = false;
        this.optimizacion = false;
        this.analisis = false;
        this.gestion = true;
        break;
      case 7:
        this.como = false;
        this.cumplimiento = false;
        this.elaboracion = false;
        this.optimizacion = false;
        this.analisis = false;
        this.gestion = false;
        break;


    }
}

}
