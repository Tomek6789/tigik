import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProgressBarComponent } from "./progress-bar.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { BehaviorSubject } from "rxjs";

describe("ProgressBarComponent", () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressBarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    const reset$ = new BehaviorSubject(true);

    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    component.reset$ = reset$;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
