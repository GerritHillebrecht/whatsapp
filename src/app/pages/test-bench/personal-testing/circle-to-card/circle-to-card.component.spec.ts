import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleToCardComponent } from './circle-to-card.component';

describe('CircleToCardComponent', () => {
  let component: CircleToCardComponent;
  let fixture: ComponentFixture<CircleToCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CircleToCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleToCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
