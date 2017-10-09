import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchrecordComponent } from './searchrecord.component';

describe('SearchrecordComponent', () => {
  let component: SearchrecordComponent;
  let fixture: ComponentFixture<SearchrecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchrecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
