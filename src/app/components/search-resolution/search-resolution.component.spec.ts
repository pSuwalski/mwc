import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResolutionComponent } from './search-resolution.component';

describe('SearchResolutionComponent', () => {
  let component: SearchResolutionComponent;
  let fixture: ComponentFixture<SearchResolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
