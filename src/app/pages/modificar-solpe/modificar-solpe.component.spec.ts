import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarSolpeComponent } from './modificar-solpe.component';

describe('ModificarSolpeComponent', () => {
  let component: ModificarSolpeComponent;
  let fixture: ComponentFixture<ModificarSolpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarSolpeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarSolpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
