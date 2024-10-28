import { Component, AfterViewInit  } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {

  ngAfterViewInit() {
    const dropdownElementList: NodeListOf<HTMLElement> = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownElementList.forEach((dropdownToggleEl: HTMLElement) => {
      const menu = dropdownToggleEl.nextElementSibling as HTMLElement;
      if (menu) {
        dropdownToggleEl.addEventListener('click', function (event) {
          event.preventDefault();
          menu.classList.toggle('show');
          dropdownToggleEl.setAttribute('aria-expanded', menu.classList.contains('show').toString());
        });
      } else {
        console.error('Menu element not found for', dropdownToggleEl);
      }
    });
  }

}
