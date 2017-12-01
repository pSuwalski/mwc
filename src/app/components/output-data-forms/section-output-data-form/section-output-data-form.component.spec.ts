import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionOutputDataFormComponent } from './section-output-data-form.component';

describe('SectionOutputDataFormComponent', () => {
  let component: SectionOutputDataFormComponent;
  let fixture: ComponentFixture<SectionOutputDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionOutputDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionOutputDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
