import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBenchLayoutComponent } from './test-bench-layout.component';

describe('TestBenchLayoutComponent', () => {
  let component: TestBenchLayoutComponent;
  let fixture: ComponentFixture<TestBenchLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestBenchLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestBenchLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
