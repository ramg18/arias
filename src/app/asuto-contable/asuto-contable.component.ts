import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-asuto-contable',
  templateUrl: './asuto-contable.component.html',
  styleUrls: ['./asuto-contable.component.css']
})
export class AsutoContableComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Asesoría Contable en Sincelejo | Contadores Públicos | Arias & Asociados');
    this.metaService.updateTag({ name: 'description', content: 'Contadores públicos en Sincelejo especializados en gestión contable, estados financieros y cumplimiento normativo para empresas en Sucre y Colombia.' });
    this.metaService.updateTag({ property: 'og:title', content: 'Asesoría Contable en Sincelejo | Arias & Asociados' });
    this.metaService.updateTag({ property: 'og:description', content: 'Contadores públicos en Sincelejo. Gestión contable, estados financieros y cumplimiento normativo para tu empresa.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://ariasyasociados.co/servicios-contables' });
  }

  como = true;
  cumplimiento = false;
  elaboracion = false;
  optimizacion = false;
  analisis = false;
  gestion = false;
  planificacion = false;

mostrar(numero: any){
  switch (numero) {
    case 1:
      this.como = true;
      this.cumplimiento = false;
      this.elaboracion = false;
      this.optimizacion = false;
      this.analisis = false;
      this.gestion = false;
      this.planificacion = false;

      break;
    case 2:
      this.como = false;
      this.cumplimiento = true;
      this.elaboracion = false;
      this.optimizacion = false;
      this.analisis = false;
      this.gestion = false;
      this.planificacion = false;
      break;
    case 3:
      this.como = false;
      this.cumplimiento = false;
      this.elaboracion = true;
      this.optimizacion = false;
      this.analisis = false;
      this.gestion = false;
      this.planificacion = false;
      break;
    case 4:
      this.como = false;
      this.cumplimiento = false;
      this.elaboracion = false;
      this.optimizacion = true;
      this.analisis = false;
      this.gestion = false;
      this.planificacion = false;
      break;
    case 5:
      this.como = false;
      this.cumplimiento = false;
      this.elaboracion = false;
      this.optimizacion = false;
      this.analisis = true;
      this.gestion = false;
      this.planificacion = false;
      break;
    case 6:
      this.como = false;
      this.cumplimiento = false;
      this.elaboracion = false;
      this.optimizacion = false;
      this.analisis = false;
      this.gestion = true;
      this.planificacion = false;
      break;
    case 7:
      this.como = false;
      this.cumplimiento = false;
      this.elaboracion = false;
      this.optimizacion = false;
      this.analisis = false;
      this.gestion = false;
      this.planificacion = true;
      break;


  }
}

}
