import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelOutputDataFormComponent } from './parcel-output-data-form.component';

describe('ParcelOutputDataFormComponent', () => {
  let component: ParcelOutputDataFormComponent;
  let fixture: ComponentFixture<ParcelOutputDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelOutputDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelOutputDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
