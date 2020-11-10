import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Element } from "app/models/element";
import { PeriodicTableRoom } from "app/services/rooms.service";

@Component({
  selector: "app-periodic-table",
  templateUrl: "./periodic-table.component.html",
  styleUrls: ["./periodic-table.component.css"],
})
export class PeriodicTableComponent {
  @Input() table: Element[];
  @Input() periodicTableRoom: PeriodicTableRoom;

  @Output() selected: EventEmitter<string> = new EventEmitter();

  handleSelected(symbol: string) {
    this.selected.emit(symbol);
  }
}
