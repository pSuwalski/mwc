import { TestBed, inject } from '@angular/core/testing';

import { ResolutionsService } from './resolutions.service';

describe('ResolutionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResolutionsService]
    });
  });

  it('should be created', inject([ResolutionsService], (service: ResolutionsService) => {
    expect(service).toBeTruthy();
  }));
});
