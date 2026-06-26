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
    this.titleService.setTitle('Asesoría Tributaria | Arias & Asociados');
    this.metaService.updateTag({ name: 'description', content: 'Optimización de impuestos y cumplimiento tributario. Evita sanciones y maximiza tus beneficios fiscales.' });
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
