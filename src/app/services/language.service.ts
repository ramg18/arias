import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLang: string = 'es';

  constructor(
    private translate: TranslateService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  /**
   * Initializes the language based on the browser's language preference.
   * Defaults to Spanish (ES) for SEO purposes — the business is in Colombia.
   * Switches to English only if navigator.language starts with 'en'.
   */
  initLanguage(): void {
    const browserLang = navigator.language || navigator.languages?.[0] || 'es';
    this.currentLang = browserLang.toLowerCase().startsWith('en') ? 'en' : 'es';

    this.translate.setDefaultLang('es');
    this.translate.use(this.currentLang);

    // Update <html lang="..."> attribute for SEO
    document.documentElement.lang = this.currentLang;

    // Update meta tags for SEO based on language
    this.updateSeoMeta();
  }

  /**
   * Manually switch the language. Updates <html lang> and meta tags.
   */
  switchLanguage(lang: 'es' | 'en'): void {
    this.currentLang = lang;
    this.translate.use(lang);
    document.documentElement.lang = lang;
    this.updateSeoMeta();
  }

  getCurrentLang(): string {
    return this.currentLang;
  }

  private updateSeoMeta(): void {
    this.translate.get(['META.SITE_TITLE', 'META.SITE_DESC']).subscribe(translations => {
      this.titleService.setTitle(translations['META.SITE_TITLE']);
      this.metaService.updateTag({ name: 'description', content: translations['META.SITE_DESC'] });
    });
  }
}
