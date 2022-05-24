import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarSolpeComponent } from './liberar-solpe.component';

describe('LiberarSolpeComponent', () => {
  let component: LiberarSolpeComponent;
  let fixture: ComponentFixture<LiberarSolpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiberarSolpeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiberarSolpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
