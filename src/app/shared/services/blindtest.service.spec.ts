import { TestBed } from '@angular/core/testing';

import { BlindtestService } from './blindtest.service';

describe('BlindtestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlindtestService = TestBed.get(BlindtestService);
    expect(service).toBeTruthy();
  });
});
