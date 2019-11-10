import { TestBed, inject } from "@angular/core/testing";

import { PeriodicTableService } from "./periodic-table.service";
import { HttpClientModule } from "@angular/common/http";

describe("PeriodicTableService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PeriodicTableService]
    });
  });

  it("should be created", inject(
    [PeriodicTableService],
    (service: PeriodicTableService) => {
      expect(service).toBeTruthy();
    }
  ));
});
