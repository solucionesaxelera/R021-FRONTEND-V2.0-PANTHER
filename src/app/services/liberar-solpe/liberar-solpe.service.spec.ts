import { TestBed } from '@angular/core/testing';

import { LiberarSolpeService } from './liberar-solpe.service';

describe('LiberarSolpeService', () => {
  let service: LiberarSolpeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiberarSolpeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
