import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { combineLatest, Observable, timer } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";

@Component({
  selector: "app-progress-bar",
  templateUrl: "./progress-bar.component.html",
  styleUrls: ["./progress-bar.component.css"],
})
export class ProgressBarComponent implements OnInit {
  color = "primary";
  mode = "determinate";
  value$: Observable<number>;
  show$: Observable<boolean>;

  @Input() reset$: Observable<boolean>;
  @Input() singlePlayerMode$: Observable<boolean>;

  @Output() finish: EventEmitter<void> = new EventEmitter();

  ngOnInit() {
    this.show$ = this.reset$.pipe(map((v) => v));

    let timer$ = timer(0, 50).pipe(
      take(101),
      tap((x) => {
        if (x === 100) {
          this.finish.emit();
        }
      })
    );

    this.value$ = this.reset$.pipe(switchMap(() => timer$));
  }
}
