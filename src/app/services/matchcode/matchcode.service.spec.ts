import { TestBed } from '@angular/core/testing';

import { MatchcodeService } from './matchcode.service';

describe('MatchcodeService', () => {
  let service: MatchcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
