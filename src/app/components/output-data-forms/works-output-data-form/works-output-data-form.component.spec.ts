import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksOutputDataFormComponent } from './works-output-data-form.component';

describe('WorksOutputDataFormComponent', () => {
  let component: WorksOutputDataFormComponent;
  let fixture: ComponentFixture<WorksOutputDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksOutputDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksOutputDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
