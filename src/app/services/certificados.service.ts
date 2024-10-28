import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CertificadosService {

  constructor( private http: HttpClient ) { }

  listSeminarios(){
    return this.http.get( '../../assets/seminarios.json' )
  }

}
