import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationsDataFormComponent } from './authorizations-data-form.component';

describe('AuthorizationsDataFormComponent', () => {
  let component: AuthorizationsDataFormComponent;
  let fixture: ComponentFixture<AuthorizationsDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizationsDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationsDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
