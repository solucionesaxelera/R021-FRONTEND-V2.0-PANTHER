import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchcodeComponent } from './matchcode.component';

describe('MatchcodeComponent', () => {
  let component: MatchcodeComponent;
  let fixture: ComponentFixture<MatchcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
