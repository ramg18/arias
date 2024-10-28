import { Component, OnInit } from '@angular/core';
import { BlogservicesService } from '../services/blogservices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  posts: any[] = [];
  links: any[] = [];
  current_page: number = 1;
  last_page = 0;
  total_paginas: any = [];
  posicion_lista: any = 0;
  totalPosts: number = 0;

  constructor( private BlogSvc:BlogservicesService, public route: Router ){

  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.BlogSvc.listEntradas(this.current_page).subscribe((response: any) => {
      console.log(response);

      this.posts = response.data;  // Posts en la página actual
      this.current_page = response.current_page;
      this.last_page = response.last_page;
      let page = this.paginacion(this.last_page);
      this.total_paginas = page;

    });
  }

  // Funciones para manejar la paginación
  cambioPagina(nueva_page: number){
    console.log(nueva_page);
    this.current_page = nueva_page;
    this.getPosts();

  }

  lista_avanza(){
    console.log('avanza',this.current_page);

    if (this.current_page < this.last_page) {
      this.posicion_lista++;
      this.current_page = this.total_paginas[this.posicion_lista][0].page;
      console.log(this.total_paginas[this.posicion_lista][0].page);
      this.getPosts();

    }
    //
  }

  lista_retrocede(){
    console.log('retrocede',this.current_page);
    if (this.current_page > 1) {
      this.posicion_lista--;
      this.current_page = this.total_paginas[this.posicion_lista][0].page;
      console.log(this.total_paginas[this.posicion_lista][0].page);
      this.getPosts();
    }

    //
  }

  first_position(){
    this.posicion_lista = 0;
    this.current_page = 1;
    this.getPosts();
  }

  last_position(){
    this.posicion_lista = this.total_paginas.length - 1;
    this.current_page = this.last_page;
    this.getPosts();
  }

  paginacion(last: number){
    const total_paginas: any[] = [];
    const paginasPorGrupo = 4;
    let grupoActual: any[] = [];

    for (let i = 1; i <= last; i++) {
      grupoActual.push({ page: i });

      if (i % paginasPorGrupo === 0 || i === last) {
        total_paginas.push(grupoActual);
        grupoActual = [];
      }
    }

    // Elimina los grupos vacíos al final (si los hay)
    while (total_paginas.length > 0 && total_paginas[total_paginas.length - 1].length === 0) {
      total_paginas.pop();
    }

    return total_paginas;
	}

  irEntrada(identrada: string){
    console.log(identrada);

    this.route.navigate(['/blog-details/',{ state: { id: identrada } }]);
  }

}
