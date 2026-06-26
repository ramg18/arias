import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BlogservicesService } from '../services/blogservices.service';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-detalle-blog',
  templateUrl: './detalle-blog.component.html',
  styleUrls: ['./detalle-blog.component.css']
})
export class DetalleBlogComponent implements OnInit {

  identrada: any;
  entrada: any;

  constructor(
    private router: ActivatedRoute,
    private BlogSvc: BlogservicesService,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.router.params.subscribe(params => {
      this.identrada = params['id'];
    });
  }

  ngOnInit(): void {
    this.listarEntrada();
  }

  listarEntrada() {
    this.BlogSvc.detalleEntrada(this.identrada).subscribe(
      (res: any) => {
        this.entrada = res;
        this.setSeoTags(res);
      }
    );
  }

  private setSeoTags(post: any): void {
    const title = `${post.title} | Arias & Asociados`;
    const description = post.excerpt || post.body?.replace(/<[^>]+>/g, '').substring(0, 155) || '';
    const url = `https://ariasyasociados.co/blog-details/${this.identrada}`;
    const image = post.image || 'https://ariasyasociados.co/assets/images/logo/logo.png';

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:image', content: image });

    this.setCanonical(url);
    this.setBlogSchema(post, url, image);
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setBlogSchema(post: any, url: string, image: string): void {
    const existing = this.doc.getElementById('blog-schema');
    if (existing) existing.remove();
    const script = this.doc.createElement('script');
    script.id = 'blog-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.excerpt || '',
      'image': image,
      'datePublished': post.created_at,
      'dateModified': post.updated_at || post.created_at,
      'author': { '@type': 'Organization', 'name': 'Arias & Asociados S.A.S' },
      'publisher': {
        '@type': 'Organization',
        'name': 'Arias & Asociados S.A.S',
        'logo': { '@type': 'ImageObject', 'url': 'https://ariasyasociados.co/assets/images/logo/logo.png' }
      },
      'mainEntityOfPage': { '@type': 'WebPage', '@id': url }
    });
    this.doc.head.appendChild(script);
  }



}
