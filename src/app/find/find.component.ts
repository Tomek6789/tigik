import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-find",
  templateUrl: "./find.component.html",
  styleUrls: ["./find.component.css"],
})
export class FindComponent {
  @Input() searchingElement: string;
}
