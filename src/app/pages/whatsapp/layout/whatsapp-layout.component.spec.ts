import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappLayoutComponent } from './whatsapp-layout.component';

describe('WhatsappLayoutComponent', () => {
  let component: WhatsappLayoutComponent;
  let fixture: ComponentFixture<WhatsappLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
