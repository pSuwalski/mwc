import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksdoneDataFormComponent } from './worksdone-data-form.component';

describe('WorksdoneDataFormComponent', () => {
  let component: WorksdoneDataFormComponent;
  let fixture: ComponentFixture<WorksdoneDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksdoneDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksdoneDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
