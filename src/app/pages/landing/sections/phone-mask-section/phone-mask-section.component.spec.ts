import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneMaskSectionComponent } from './phone-mask-section.component';

describe('PhoneMaskSectionComponent', () => {
  let component: PhoneMaskSectionComponent;
  let fixture: ComponentFixture<PhoneMaskSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PhoneMaskSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneMaskSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
