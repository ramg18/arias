import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsutoJuridicoComponent } from './asuto-juridico.component';

describe('AsutoJuridicoComponent', () => {
  let component: AsutoJuridicoComponent;
  let fixture: ComponentFixture<AsutoJuridicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsutoJuridicoComponent]
    });
    fixture = TestBed.createComponent(AsutoJuridicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
