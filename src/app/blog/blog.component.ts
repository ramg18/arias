import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { BlogservicesService } from '../services/blogservices.service';
import { Router } from '@angular/router';
import {PaginationInstance} from 'ngx-pagination';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

  constructor( private BlogSvc:BlogservicesService, public route: Router, private sanitizer: DomSanitizer ){

  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.BlogSvc.listEntradas(this.current_page).subscribe((response: any) => {

      this.posts = response.data.map((post: any) => ({
        ...post, // Copia todas las propiedades existentes del post
        body: this.truncateAndSanitizeHtml(post.body, 200) // Solo actualiza 'body'
      }));


      // this.posts = response.data;  // Posts en la página actual
      this.current_page = response.current_page;
      this.total_paginas = response.last_page;


    });
  }

  truncateAndSanitizeHtml(html: string, limit: number): SafeHtml {

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const textContent = doc.body.textContent || '';

    if (textContent.length > limit) {
      const truncatedText = textContent.substr(0, limit) + '...';
      console.log(truncatedText);

      return this.sanitizer.bypassSecurityTrustHtml(truncatedText);
    }

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getMiddlePages(): number[] {
    let start, end;
    if (this.total_paginas <= 5) {
      // Si hay 5 o menos páginas, mostrar todas
      start = 2;
      end = this.total_paginas - 1;
    } else {
      // Calcula las páginas alrededor de la página actual
      start = Math.max(2, this.current_page - 2);
      end = Math.min(this.total_paginas - 1, this.current_page + 2);
      // Ajusta si la página actual está cerca del inicio o el final
      if (this.current_page < 4) {
        end = 5;
      }
      if (this.current_page > this.total_paginas - 4) {
        start = this.total_paginas - 4;
      }
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }


  goToPage(page: number, event: Event) {
    event.preventDefault();
    if (page !== this.current_page && page > 0 && page <= this.total_paginas) {
      this.current_page = page;
      this.getPosts();
    }
  }



  irEntrada(identrada: string){

    this.route.navigate(['/blog-details/', identrada]);
  }

}
