import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalbasisDataFormComponent } from './legalbasis-data-form.component';

describe('LegalbasisDataFormComponent', () => {
  let component: LegalbasisDataFormComponent;
  let fixture: ComponentFixture<LegalbasisDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalbasisDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalbasisDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
