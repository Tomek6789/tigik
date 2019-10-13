import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { TimerObservable } from "rxjs/observable/TimerObservable";

@Component({
  selector: "app-progress-bar",
  templateUrl: "./progress-bar.component.html",
  styleUrls: ["./progress-bar.component.css"]
})
export class ProgressBarComponent implements OnInit {
  color = "primary";
  mode = "determinate";
  value$: Observable<number>;
  @Input() reset$: Observable<any>;

  @Output() finish: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {
    let timer$ = TimerObservable.create(0, 10)
      .take(101)
      .map(x => {
        if (x === 100) {
          this.finish.emit(false);
        }
        return x;
      });
    this.value$ = this.reset$.switchMap(() => timer$);
  }
}
