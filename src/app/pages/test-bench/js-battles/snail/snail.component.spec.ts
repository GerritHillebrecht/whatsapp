import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnailComponent } from './snail.component';

describe('SnailComponent', () => {
  let component: SnailComponent;
  let fixture: ComponentFixture<SnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SnailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
