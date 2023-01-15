import { TestBed } from '@angular/core/testing';

import { MessageComposeService } from './message-compose.service';

describe('MessageComposeService', () => {
  let service: MessageComposeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageComposeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
