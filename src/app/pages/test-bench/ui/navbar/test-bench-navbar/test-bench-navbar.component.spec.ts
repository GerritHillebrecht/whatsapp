import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBenchNavbarComponent } from './test-bench-navbar.component';

describe('TestBenchNavbarComponent', () => {
  let component: TestBenchNavbarComponent;
  let fixture: ComponentFixture<TestBenchNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TestBenchNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestBenchNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
