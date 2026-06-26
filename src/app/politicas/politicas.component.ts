import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.css']
})
export class PoliticasComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle('Políticas de Privacidad | Arias & Asociados S.A.S');
    this.metaService.updateTag({ name: 'description', content: 'Política de privacidad y tratamiento de datos de Arias & Asociados S.A.S.' });
    this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' }); // Privacy policies are often noindex, or maybe index? User said "uso privado", "interna". Probably safer to index if it's a legal requirement, but the text says "aplicación interna". I'll index it just in case, or maybe noindex since it says "no recopila datos". Actually, usually privacy pages SHOULD be indexed. I'll remove noindex to be safe, standard SEO.
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
  }

}
