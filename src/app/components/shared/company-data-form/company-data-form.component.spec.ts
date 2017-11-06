import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDataFormComponent } from './company-data-form.component';

describe('CompanyDataFormComponent', () => {
  let component: CompanyDataFormComponent;
  let fixture: ComponentFixture<CompanyDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
