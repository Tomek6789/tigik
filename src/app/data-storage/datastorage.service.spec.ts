import { TestBed, inject } from "@angular/core/testing";

import { DatastorageService } from "./datastorage.service";
import { HttpClientModule } from "@angular/common/http";

describe("DatastorageService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DatastorageService]
    });
  });

  it("should be created", inject(
    [DatastorageService],
    (service: DatastorageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
