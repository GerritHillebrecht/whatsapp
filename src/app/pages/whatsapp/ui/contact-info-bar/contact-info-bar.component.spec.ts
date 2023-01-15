import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoBarComponent } from './contact-info-bar.component';

describe('ContactInfoBarComponent', () => {
  let component: ContactInfoBarComponent;
  let fixture: ComponentFixture<ContactInfoBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ContactInfoBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactInfoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
