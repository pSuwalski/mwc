import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorksdoneComponent } from './add-worksdone.component';

describe('AddWorksdoneComponent', () => {
  let component: AddWorksdoneComponent;
  let fixture: ComponentFixture<AddWorksdoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorksdoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorksdoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
