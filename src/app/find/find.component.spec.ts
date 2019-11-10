import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FindComponent } from "./find.component";
import { of } from "rxjs";

describe("FindComponent", () => {
  let component: FindComponent;
  let fixture: ComponentFixture<FindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FindComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindComponent);
    component = fixture.componentInstance;
    component.level$ = of("a");
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
