import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-revisoria-fiscal',
  templateUrl: './revisoria-fiscal.component.html',
  styleUrls: ['./revisoria-fiscal.component.css']
})
export class RevisoriaFiscalComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Revisoría Fiscal en Sincelejo | Revisor Fiscal Certificado | Arias & Asociados');
    this.metaService.updateTag({ name: 'description', content: 'Revisoría fiscal certificada en Sincelejo y Sucre. Revisores fiscales para sociedades, empresas con obligación legal y auditoría financiera en Colombia.' });
    this.metaService.updateTag({ property: 'og:title', content: 'Revisoría Fiscal en Sincelejo | Arias & Asociados' });
    this.metaService.updateTag({ property: 'og:description', content: 'Revisoría fiscal certificada en Sincelejo. Revisores fiscales para sociedades y empresas con obligación legal en Sucre, Colombia.' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://ariasyasociados.co/revisoria-fiscal' });
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
