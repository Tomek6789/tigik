import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Element } from "app/models/element";

@Component({
  selector: "app-periodic-table",
  templateUrl: "./periodic-table.component.html",
  styleUrls: ["./periodic-table.component.css"],
})
export class PeriodicTableComponent {
  @Input() table: Element[];

  @Output() selected: EventEmitter<string> = new EventEmitter();

  handleSelected(symbol: string) {
    this.selected.emit(symbol);
  }
}
