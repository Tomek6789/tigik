import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { Subscription } from "rxjs";

@Component({
  selector: "app-find",
  templateUrl: "./find.component.html",
  styleUrls: ["./find.component.css"],
})
export class FindComponent {
  @Input() searchingElement: string;
  // private subscription: Subscription;
  // public find: string;

  // ngOnInit() {
  //   this.subscription = this.level$.subscribe((level: string) => {
  //     if (this.level !== level) {
  //       this.level = level;
  //       this.table = this.table.concat(Test[this.level]);
  //     }
  //     this.findElement();
  //   });
  // }

  // ngOnDestroy() {
  //   this.level = "";
  //   this.subscription.unsubscribe();
  // }

  // public findElement() {
  //   const number = Math.floor(Math.random() * (this.table.length - 1)) + 1;
  //   this.find = this.table[number];
  // }
}
