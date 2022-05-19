import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolpeComponent } from './crear-solpe.component';

describe('CrearSolpeComponent', () => {
  let component: CrearSolpeComponent;
  let fixture: ComponentFixture<CrearSolpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearSolpeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSolpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
