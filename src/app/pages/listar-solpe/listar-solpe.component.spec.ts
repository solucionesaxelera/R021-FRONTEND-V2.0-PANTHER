import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSolpeComponent } from './listar-solpe.component';

describe('ListarSolpeComponent', () => {
  let component: ListarSolpeComponent;
  let fixture: ComponentFixture<ListarSolpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarSolpeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarSolpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
