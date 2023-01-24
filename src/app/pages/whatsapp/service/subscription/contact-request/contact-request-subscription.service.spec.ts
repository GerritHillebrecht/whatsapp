import { TestBed } from '@angular/core/testing';

import { ContactRequestSubscriptionService } from './contact-request-subscription.service';

describe('ContactRequestSubscriptionService', () => {
  let service: ContactRequestSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactRequestSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
