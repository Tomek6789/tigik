import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { timer, of } from "rxjs";
import { take, tap, repeatWhen } from "rxjs/operators";

@Component({
  selector: "app-progress-bar",
  templateUrl: "./progress-bar.component.html",
  styleUrls: ["./progress-bar.component.css"],
})
export class ProgressBarComponent implements OnInit {
  color = "primary";
  mode = "determinate";
  value$: Observable<number>;
  @Input() reset$: Observable<boolean>;

  @Output() finish: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {
    let timer$ = timer(0, 100).pipe(
      take(101),
      tap((x) => {
        if (x === 100) {
          this.finish.emit(false);
        }
      })
    );

    this.value$ = this.reset$.switchMap(() => timer$);
  }
}
