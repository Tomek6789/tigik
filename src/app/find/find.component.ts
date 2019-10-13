import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { Subscription } from "rxjs";

const Test = {
  One: ["K", "Na", "Ca"],
  Two: ["Al", "Zn", "Co"],
  Three: ["H", "O"],
  Four: ["N", "C"],
  Five: ["Si", "O"]
};

@Component({
  selector: "app-find",
  templateUrl: "./find.component.html",
  styleUrls: ["./find.component.css"]
})
export class FindComponent implements OnInit, OnDestroy {
  @Input() level$: Observable<string>;
  private subscription: Subscription;
  public find: string;
  private level = "";
  private table = [];

  ngOnInit() {
    this.subscription = this.level$.subscribe((level: string) => {
      if (this.level !== level) {
        this.level = level;
        this.table = this.table.concat(Test[this.level]);
        console.log(this.table);
      }
      this.findElement();
    });
  }

  ngOnDestroy() {
    this.level = "";
    this.subscription.unsubscribe();
  }

  public findElement() {
    const number = Math.floor(Math.random() * (this.table.length - 1)) + 1;
    this.find = this.table[number];
  }
}
