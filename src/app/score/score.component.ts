import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent{

  counterValue = 0;
  @Output() counterChange = new EventEmitter();
  
  @Input()
  get counter() {
    return this.counterValue;
  }
  
  set counter(val) {
    this.counterValue = val;
    this.counterChange.emit(this.counterValue);
  }

  ngOnDestroy(){
    console.log('tes')
  }

  public decrement() {
    this.counter -= 10;
  }
  
  public increment() {
    this.counter += 10;
  }

  public currentLevel(): string {
    switch(true) {
      case (this.counter <= 20):
        return 'One';
      case (this.counter <= 30):
        return 'Two';
      case (this.counter <= 50):
        return 'Three';
      case (this.counter <= 60):
        return 'Four';
      case (this.counter <= 70):
        return 'Five';
      default: 
        return 'One';
    }
  }
}
