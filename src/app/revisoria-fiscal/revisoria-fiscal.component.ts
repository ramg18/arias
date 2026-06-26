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
    this.titleService.setTitle('Revisoría Fiscal | Arias & Asociados');
    this.metaService.updateTag({ name: 'description', content: 'Auditoría integral y aseguramiento de la información financiera para tu empresa.' });
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
