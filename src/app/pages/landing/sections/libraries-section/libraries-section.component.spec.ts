import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrariesSectionComponent } from './libraries-section.component';

describe('LibrariesSectionComponent', () => {
  let component: LibrariesSectionComponent;
  let fixture: ComponentFixture<LibrariesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LibrariesSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrariesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
