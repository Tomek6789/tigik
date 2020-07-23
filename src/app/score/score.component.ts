import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-score",
  templateUrl: "./score.component.html",
  styleUrls: ["./score.component.css"],
})
export class ScoreComponent {
  @Input() points: number;
}
