import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBlogComponent } from './detalle-blog.component';

describe('DetalleBlogComponent', () => {
  let component: DetalleBlogComponent;
  let fixture: ComponentFixture<DetalleBlogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleBlogComponent]
    });
    fixture = TestBed.createComponent(DetalleBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
