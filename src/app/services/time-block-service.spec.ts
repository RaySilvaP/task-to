import { TestBed } from '@angular/core/testing';

import { TimeBlockService } from './time-block-service';

describe('TimeBlockService', () => {
  let service: TimeBlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeBlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
