import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {

  private apiUrl = 'https://v6.exchangerate-api.com/v6/dc86afb7409ce8d99ea03eb9/latest/USD';

  constructor(private http: HttpClient) { }

  getIndicadores(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(response => this.transformData(response))
    );
  }

  private transformData(data: any): any {
    const usdToCop = data.conversion_rates.COP;
    const rates = data.conversion_rates;

    return {
      dolar: usdToCop,
      euro: (1 / rates.EUR) * usdToCop,
      yen: (1 / rates.JPY) * usdToCop,
      libraEsterlina: (1 / rates.GBP) * usdToCop
    };
  }
}
