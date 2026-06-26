import { Component, OnInit } from '@angular/core';
import { CertificadosService } from '../services/certificados.service';
import { environment } from 'src/environments/environment';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.css']
})
export class CertificadosComponent implements OnInit {

  constructor(
    private certificadoSVC: CertificadosService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  seminarios: any [] = [];
  seminario:any;
  cedula:any;

  ngOnInit(): void {
    this.titleService.setTitle('Descarga de Certificados | Arias & Asociados S.A.S');
    this.metaService.updateTag({ name: 'description', content: 'Descarga tus certificados de retención en la fuente e ICA de forma rápida y segura en nuestra plataforma.' });
    
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

    if (this.cedula && this.seminario) {
      // Trim input to clean up user entry
      const cedulaClean = this.cedula.toString().trim();
      // Relative path works best for local/prod compatibility
      const ruta = `/assets/certificados/${this.seminario}/${cedulaClean}.pdf`;
      const fileName = `Certificado_${cedulaClean}.pdf`;

      if (typeof document === 'undefined') return;
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = ruta;
      link.download = fileName;
      link.target = '_blank'; // Fallback behavior
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  }

}
