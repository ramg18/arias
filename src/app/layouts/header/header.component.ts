import { Component, AfterViewInit, HostListener } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {

  isServiciosOpen = false;

  constructor(
    public languageSvc: LanguageService,
    public authService: AuthService
  ) {}

  ngAfterViewInit() {}

  toggleServicios(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isServiciosOpen = !this.isServiciosOpen;
  }

  closeDropdown() {
    this.isServiciosOpen = false;
  }

  toggleLanguage(): void {
    const newLang = this.languageSvc.getCurrentLang() === 'es' ? 'en' : 'es';
    this.languageSvc.switchLanguage(newLang as 'es' | 'en');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isServiciosOpen = false;
    }
  }
}
