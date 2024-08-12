import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { tadaAnimation } from "angular-animations";
import { Element } from "app/models/element";

@Component({
  selector: "app-periodic-table",
  templateUrl: "./periodic-table.component.html",
  styleUrls: ["./periodic-table.component.css"],
  animations: [
    tadaAnimation({direction: '=>', duration: 500})
  ]
})
export class PeriodicTableComponent implements OnChanges {
  @Input() table: Element[];
  @Input() searchingElement: string;
  @Input() animate: string;

  @Output() selected: EventEmitter<string> = new EventEmitter();

  ngOnChanges() {
    if(this.animate) {

      this.table.forEach((element) => {
        if(element.symbol === this.animate) {          
          setTimeout(() => {
            element.animate = true
          }, 1 )
        } else {
          element.animate = false
        }
      })
    }
  }

  handleSelected(element: Element) {

    if(element.symbol === this.searchingElement) {

      // this.animate(element)
      
      this.selected.emit(element.symbol);
    }
  }
}
