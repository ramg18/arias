import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicarService {
  // Webhook URL provided by the user
  private apiUrl = 'https://flujos.koudelagency.cloud/webhook/recepcion'; 

  constructor(private http: HttpClient) { }

  subirPublicacion(tipo: string, archivo: File, imageUrl: string, usuario: string): Observable<any> {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('archivo', archivo);
    formData.append('imageUrl', imageUrl);
    formData.append('usuario', usuario);

    return this.http.post(this.apiUrl, formData);
  }
}
