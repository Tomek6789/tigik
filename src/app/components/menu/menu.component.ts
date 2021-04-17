import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent {
  @Input() isStartGame: boolean;

  @Output() showRooms = new EventEmitter();
  @Output() startGame = new EventEmitter();

  onShowRooms() {
    this.showRooms.emit();
  }

  onStartGame() {
    this.startGame.emit();
  }
}
