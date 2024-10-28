import { Component, OnInit } from '@angular/core';
import { CertificadosService } from '../services/certificados.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.css']
})
export class CertificadosComponent implements OnInit {

  constructor( private certificadoSVC: CertificadosService ){}

  seminarios: any [] = [];
  seminario:any;
  cedula:any;

  ngOnInit(): void {
    this.listarSeminarios()
  }

  listarSeminarios(){
    this.certificadoSVC.listSeminarios().subscribe(
      (data:any) => {
        this.seminarios = data;

      }
    );
  }

  descargarCertificado(){

    const url = 'https://ariasyasociados.co/assets/certificados/';

    if (this.cedula && this.seminario) {
      let ruta = `https://ariasyasociados.co/assets/certificados/${this.seminario}/${this.cedula}.pdf`;


      window.open(ruta, '_blank');

    }

  }

}
