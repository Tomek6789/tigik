import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent {
  @Input() isStartGame: boolean;
  @Input() searchingElement: string;
  @Input() isLogin: boolean;
  @Input() showInvite: boolean;

  @Output() startGame = new EventEmitter();
  @Output() signIn = new EventEmitter();
  @Output() invite = new EventEmitter();

  onStartGame() {
    this.startGame.emit();
  }

  onSignIn() {
    this.signIn.emit()
  }
  
  onInvite() {
    this.invite.emit()
  }

}
