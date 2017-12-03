import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionOutputDataFormComponent } from './resolution-output-data-form.component';

describe('ResolutionOutputDataFormComponent', () => {
  let component: ResolutionOutputDataFormComponent;
  let fixture: ComponentFixture<ResolutionOutputDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionOutputDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionOutputDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
