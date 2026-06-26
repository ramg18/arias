import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Arias & Asociados S.A.S';

  constructor(
    private languageService: LanguageService,
    @Inject(DOCUMENT) private doc: Document
  ) { }

  ngOnInit() {
    // Detect browser language and set site language (ES default for SEO)
    this.languageService.initLanguage();

    // Canonical link
    let link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', 'https://ariasyasociados.co/home');
    this.doc.head.appendChild(link);
  }
}
