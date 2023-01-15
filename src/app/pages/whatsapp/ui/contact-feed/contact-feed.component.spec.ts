import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFeedComponent } from './contact-feed.component';

describe('ContactFeedComponent', () => {
  let component: ContactFeedComponent;
  let fixture: ComponentFixture<ContactFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ContactFeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
