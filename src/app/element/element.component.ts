import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Element } from '../models/element';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})
export class ElementComponent {

  @Input() element: Element; 
  @Output() selected: EventEmitter<any> = new EventEmitter();

  handleClick(symbol: string) {
    this.selected.emit(symbol);
  }

}
