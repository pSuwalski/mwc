import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerOutputDataFormComponent } from './owner-output-data-form.component';

describe('OwnerOutputDataFormComponent', () => {
  let component: OwnerOutputDataFormComponent;
  let fixture: ComponentFixture<OwnerOutputDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerOutputDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerOutputDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
