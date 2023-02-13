import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NerdLoaderComponent } from './nerd-loader.component';

describe('NerdLoaderComponent', () => {
  let component: NerdLoaderComponent;
  let fixture: ComponentFixture<NerdLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NerdLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NerdLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
