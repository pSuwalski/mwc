import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsDataFormComponent } from './payments-data-form.component';

describe('PaymentsDataFormComponent', () => {
  let component: PaymentsDataFormComponent;
  let fixture: ComponentFixture<PaymentsDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
