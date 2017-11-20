import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLeeseeComponent } from './search-leesee.component';

describe('SearchLeeseeComponent', () => {
  let component: SearchLeeseeComponent;
  let fixture: ComponentFixture<SearchLeeseeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLeeseeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLeeseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
