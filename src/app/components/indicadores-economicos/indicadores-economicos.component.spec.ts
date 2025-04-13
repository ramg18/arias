import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresEconomicosComponent } from './indicadores-economicos.component';

describe('IndicadoresEconomicosComponent', () => {
  let component: IndicadoresEconomicosComponent;
  let fixture: ComponentFixture<IndicadoresEconomicosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicadoresEconomicosComponent]
    });
    fixture = TestBed.createComponent(IndicadoresEconomicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
