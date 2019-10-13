import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DatastorageService } from "./data-storage/datastorage.service";
import { PeriodicTableService } from "./periodic-table.service";
import { Element } from "./models/element";
import { FindComponent } from "./find/find.component";
import { ScoreComponent } from "./score/score.component";
import { BehaviorSubject, Subject } from "rxjs/Rx";

import { ElementComponent } from "./element/element.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  table: Element[];
  symbol: string;
  _start = false;
  bestScore = 0;
  _score = 0;
  // correct answare should check level and reset timer;
  level$ = new BehaviorSubject("One");
  reset$ = new Subject();

  @ViewChild(FindComponent) findComponent: FindComponent;
  @ViewChild(ScoreComponent) scoreComponent: ScoreComponent;

  constructor(
    private periodicTableService: PeriodicTableService,
    private dataStorage: DatastorageService
  ) {}

  ngAfterViewInit() {}

  get score() {
    return this._score;
  }
  set score(val: number) {
    this._score = val;
    if (this._score >= this.bestScore) {
      this.bestScore = this._score;
    }
  }

  get start() {
    return this._start;
  }
  set start(val: boolean) {
    this._start = val;
    this.score = 0;
    console.log("lol");
  }

  storeToDB() {
    // this.dataStorage.saveScore()
    // .subscribe((data: any) => {
    //   console.log(data)
    // });
  }

  handleFinish(finish) {
    this.start = finish;
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
    this.start = true;
    this.reset$.next(true);
  }
}
