import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogservicesService {
  private apiUrl = `${environment.url}`;

  constructor(private http: HttpClient) { }

  listEntradas(page: number = 1, perPage: number = 10){
    return this.http.get(`${this.apiUrl}blog-posts?page=${page}&per_page=${perPage}`);
  }

  detalleEntrada(id:any){
    return this.http.get(`${this.apiUrl}blog-posts/${id}`);
  }

}
