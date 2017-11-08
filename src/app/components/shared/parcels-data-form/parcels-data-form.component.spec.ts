import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelsDataFormComponent } from './parcels-data-form.component';

describe('ParcelsDataFormComponent', () => {
  let component: ParcelsDataFormComponent;
  let fixture: ComponentFixture<ParcelsDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelsDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelsDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
