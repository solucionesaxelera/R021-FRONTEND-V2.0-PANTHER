import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSociedadesComponent } from './dialog-sociedades.component';

describe('DialogSociedadesComponent', () => {
  let component: DialogSociedadesComponent;
  let fixture: ComponentFixture<DialogSociedadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSociedadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSociedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
