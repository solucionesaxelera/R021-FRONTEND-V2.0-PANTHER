import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSolpeComponent } from './detalle-solpe.component';

describe('DetalleSolpeComponent', () => {
  let component: DetalleSolpeComponent;
  let fixture: ComponentFixture<DetalleSolpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSolpeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSolpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
