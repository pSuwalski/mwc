import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDataFormComponent } from './section-data-form.component';

describe('SectionDataFormComponent', () => {
  let component: SectionDataFormComponent;
  let fixture: ComponentFixture<SectionDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
