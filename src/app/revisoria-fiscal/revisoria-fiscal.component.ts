import { Component } from '@angular/core';

@Component({
  selector: 'app-revisoria-fiscal',
  templateUrl: './revisoria-fiscal.component.html',
  styleUrls: ['./revisoria-fiscal.component.css']
})
export class RevisoriaFiscalComponent {

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
