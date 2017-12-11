import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWorksdoneComponent } from './search-worksdone.component';

describe('SearchWorksdoneComponent', () => {
  let component: SearchWorksdoneComponent;
  let fixture: ComponentFixture<SearchWorksdoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchWorksdoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWorksdoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
