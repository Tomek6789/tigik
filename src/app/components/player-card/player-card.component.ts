import { Component, OnInit, Input } from "@angular/core";
import { User } from "app/auth/user.model";

@Component({
  selector: "app-player-card",
  templateUrl: "./player-card.component.html",
  styleUrls: ["./player-card.component.css"],
})
export class PlayerCardComponent {
  @Input() player: User;
}
