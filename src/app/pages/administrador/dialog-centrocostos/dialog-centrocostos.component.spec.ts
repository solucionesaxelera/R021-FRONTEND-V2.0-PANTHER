import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCentrocostosComponent } from './dialog-centrocostos.component';

describe('DialogCentrocostosComponent', () => {
  let component: DialogCentrocostosComponent;
  let fixture: ComponentFixture<DialogCentrocostosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCentrocostosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCentrocostosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
