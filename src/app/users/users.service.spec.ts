import { TestBed, inject } from "@angular/core/testing";

import { UserService } from "./users.service";
import { HttpClientModule } from "@angular/common/http";

describe("DatastorageService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [UserService],
    });
  });

  it("should be created", inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
