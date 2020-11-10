import { Component, EventEmitter, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Room } from "app/services/rooms.service";

export interface DialogData {
  rooms: Room[];
}

export interface Actions {
  type: ActionsTypes;
  key?: string;
}

export enum ActionsTypes {
  DELETE,
  CREATE,
  JOIN,
  START,
}

@Component({
  selector: "app-rooms-dialog",
  templateUrl: "./rooms-dialog.component.html",
  styleUrls: ["./rooms-dialog.component.css"],
})
export class RoomsDialogComponent {
  actions = new EventEmitter<Actions>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onCreateRoom() {
    this.actions.emit({
      type: ActionsTypes.CREATE,
    });
  }

  onJoinRoom(key: string) {
    this.actions.emit({
      key,
      type: ActionsTypes.JOIN,
    });
  }

  onDeleteRoom(key: string) {
    this.actions.emit({
      key,
      type: ActionsTypes.DELETE,
    });
  }

  onStartGame() {
    this.actions.emit({
      type: ActionsTypes.START,
    });
  }

  invitePlayer(key: string) {}
}
