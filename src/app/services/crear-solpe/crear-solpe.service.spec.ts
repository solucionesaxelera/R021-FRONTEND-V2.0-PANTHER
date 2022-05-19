import { TestBed } from '@angular/core/testing';

import { CrearSolpeService } from './crear-solpe.service';

describe('CrearSolpeService', () => {
  let service: CrearSolpeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearSolpeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
