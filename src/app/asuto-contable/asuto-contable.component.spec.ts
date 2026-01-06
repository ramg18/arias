import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsutoContableComponent } from './asuto-contable.component';

describe('AsutoContableComponent', () => {
  let component: AsutoContableComponent;
  let fixture: ComponentFixture<AsutoContableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsutoContableComponent]
    });
    fixture = TestBed.createComponent(AsutoContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
