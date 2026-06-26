import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsutoTributarioComponent } from './asuto-tributario.component';

describe('AsutoTributarioComponent', () => {
  let component: AsutoTributarioComponent;
  let fixture: ComponentFixture<AsutoTributarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsutoTributarioComponent]
    });
    fixture = TestBed.createComponent(AsutoTributarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
