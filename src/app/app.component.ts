import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Asesoría Contable y Legal para Empresas | Arias & Asociados S.A.S';
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Asesoría Contable y Legal para Empresas | Arias & Asociados S.A.S');
    this.metaService.addTags([
      { name: 'keywords', content: 'asesoría contable, asesoría jurídica, revisoría fiscal, asesoría tributaria, Sincelejo' },
      { name: 'canonical', href: 'https://ariasyasociados.co/#/home', rel: 'canonical' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Arias & Asociados S.A.S, contact@ariasyasociados.co' }
    ]);

    let link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', 'https://ariasyasociados.co/#/home');
    this.doc.head.appendChild(link);
  }
}
