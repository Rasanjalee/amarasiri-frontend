import { TestBed } from '@angular/core/testing';

import { InterCommunicatorService } from './inter-communicator.service';

describe('InterCommunicatorService', () => {
  let service: InterCommunicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterCommunicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
