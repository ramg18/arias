import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisoriaFiscalComponent } from './revisoria-fiscal.component';

describe('RevisoriaFiscalComponent', () => {
  let component: RevisoriaFiscalComponent;
  let fixture: ComponentFixture<RevisoriaFiscalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisoriaFiscalComponent]
    });
    fixture = TestBed.createComponent(RevisoriaFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
