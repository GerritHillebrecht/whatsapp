import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphqlOptimisticResponseComponent } from './graphql-optimistic-response.component';

describe('GraphqlOptimisticResponseComponent', () => {
  let component: GraphqlOptimisticResponseComponent;
  let fixture: ComponentFixture<GraphqlOptimisticResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GraphqlOptimisticResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphqlOptimisticResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
