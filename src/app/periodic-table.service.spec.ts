import { TestBed, inject } from '@angular/core/testing';

import { PeriodicTableService } from './periodic-table.service';

describe('PeriodicTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeriodicTableService]
    });
  });

  it('should be created', inject([PeriodicTableService], (service: PeriodicTableService) => {
    expect(service).toBeTruthy();
  }));
});
