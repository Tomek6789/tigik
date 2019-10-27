import { Component, OnInit, ViewChild } from "@angular/core";
import { DatastorageService } from "./data-storage/datastorage.service";
import { PeriodicTableService } from "./periodic-table.service";
import { Element } from "./models/element";
import { FindComponent } from "./find/find.component";
import { ScoreComponent } from "./score/score.component";
import { BehaviorSubject, Subject } from "rxjs/Rx";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  table: Element[];
  symbol: string;

  state = {
    start: false,
    bestScore: 0,
    score: 0
  };

  level$ = new BehaviorSubject("One");
  reset$ = new Subject();

  @ViewChild(FindComponent, { static: false }) findComponent: FindComponent;
  @ViewChild(ScoreComponent, { static: false }) scoreComponent: ScoreComponent;

  constructor(
    private periodicTableService: PeriodicTableService,
    private dataStorage: DatastorageService
  ) {}

  storeToDB() {
    // this.dataStorage.saveScore()
    // .subscribe((data: any) => {
    //   console.log(data)
    // });
  }

  handleFinish(finish) {
    this.state.start = finish;
    this.state.score = 0;
  }

  ngOnInit() {
    this.periodicTableService
      .getPeriodicTable()
      .subscribe((data: Element[]) => {
        this.table = data;
      });

    this.dataStorage.getScore().subscribe(data => {
      console.log(data);
    });
  }

  handleSelected(symbol: string) {
    this.symbol = symbol;
    if (this.findComponent && this.symbol === this.findComponent.find) {
      this.scoreComponent.increment();
      this.level$.next(this.scoreComponent.currentLevel());
    }
  }

  startGame() {
    this.state.start = true;
    this.reset$.next(true);
  }
}
