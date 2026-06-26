import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-asuto-juridico',
  templateUrl: './asuto-juridico.component.html',
  styleUrls: ['./asuto-juridico.component.css']
})
export class AsutoJuridicoComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Asesoría Jurídica | Arias & Asociados');
    this.metaService.updateTag({ name: 'description', content: 'Asesoría legal experta en derecho comercial, laboral y tributario para empresas en Sincelejo.' });
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
