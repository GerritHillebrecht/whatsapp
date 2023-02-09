import { TestBed } from '@angular/core/testing';

import { WhatsappUserService } from './whatsapp-user.service';

describe('WhatsappUserService', () => {
  let service: WhatsappUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatsappUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
