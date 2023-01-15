import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDeliveryStatusComponent } from './message-delivery-status.component';

describe('MessageDeliveryStatusComponent', () => {
  let component: MessageDeliveryStatusComponent;
  let fixture: ComponentFixture<MessageDeliveryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MessageDeliveryStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageDeliveryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
