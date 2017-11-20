import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeeseeComponent } from './add-leesee.component';

describe('AddLeeseeComponent', () => {
  let component: AddLeeseeComponent;
  let fixture: ComponentFixture<AddLeeseeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLeeseeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeeseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
