import { TestBed, inject } from '@angular/core/testing';

import { DatastorageService } from './datastorage.service';

describe('DatastorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatastorageService]
    });
  });

  it('should be created', inject([DatastorageService], (service: DatastorageService) => {
    expect(service).toBeTruthy();
  }));
});
