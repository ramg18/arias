import { Component } from '@angular/core';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {

  contable = true;
  tributario = false;
  revisoria = false;
  juridico = false;

mostrar(numero: any){
  switch (numero) {
    case 1:
      this.contable = true;
      this.tributario = false;
      this.revisoria = false;
      this.juridico = false;

      break;
    case 2:
      this.contable = false;
      this.tributario = false;
      this.revisoria = false;
      this.juridico = true;
      break;
    case 3:
      this.contable = false;
      this.tributario = true;
      this.revisoria = false;
      this.juridico = false;
      break;
    case 4:
      this.contable = false;
      this.tributario = false;
      this.revisoria = true;
      this.juridico = false;
      break;


  }
}

}
