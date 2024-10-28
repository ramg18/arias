import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'rutas'
})
export class RutasPipe implements PipeTransform {

  transform(img: any, tipo: any): any {
    let url = environment.link;
    switch (tipo) {
      case 'b':
      return url + img;
        break;

    }

    return url;
  }

}
