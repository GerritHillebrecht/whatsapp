import { TestBed } from '@angular/core/testing';

import { ReadUpdateSubscriptionService } from './read-update-subscription.service';

describe('ReadUpdateSubscriptionService', () => {
  let service: ReadUpdateSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadUpdateSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
