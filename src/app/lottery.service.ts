import { Injectable } from "@angular/core";

const Test = {
  One: ["K", "Na", "Ca"],
  Two: ["Al", "Zn", "Co"],
  Three: ["H", "O"],
  Four: ["N", "C"],
  Five: ["Si", "O"],
};

@Injectable({
  providedIn: "root",
})
export class LotteryService {
  public element = "Na";

  private table = [];
  drawElement(score: number) {
    this.table = this.table.concat(Test[this.currentLevel(score)]);
    return this.findElement();
  }

  public currentLevel(score: number): string {
    switch (true) {
      case score <= 20:
        return "One";
      case score <= 30:
        return "Two";
      case score <= 50:
        return "Three";
      case score <= 60:
        return "Four";
      case score <= 70:
        return "Five";
      default:
        return "One";
    }
  }

  public findElement(): string {
    const number = Math.floor(Math.random() * (this.table.length - 1)) + 1;
    return this.table[number];
  }
}
