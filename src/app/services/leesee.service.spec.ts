import { TestBed, inject } from '@angular/core/testing';

import { LeeseeService } from './leesee.service';

describe('LeeseeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeeseeService]
    });
  });

  it('should be created', inject([LeeseeService], (service: LeeseeService) => {
    expect(service).toBeTruthy();
  }));
});
