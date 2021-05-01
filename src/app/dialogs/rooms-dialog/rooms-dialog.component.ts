import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RoomsPlayers } from "app/app.state";
import { User } from "app/auth/user.model";

@Component({
  selector: "app-rooms-dialog",
  templateUrl: "./rooms-dialog.component.html",
  styleUrls: ["./rooms-dialog.component.css"],
})
export class RoomsDialogComponent {
  @Input() rooms: RoomsPlayers[]
  @Input() userRoomUid: string;
  @Input() hasRoom: boolean;


  @Output() close = new EventEmitter()
  @Output() createRoom = new EventEmitter()
  @Output() invitePleyer = new EventEmitter()
  @Output() joinRoom = new EventEmitter()
  @Output() deleteRoom = new EventEmitter()

  closeRooms() {
    this.close.emit()
  }

  onJoinRoom(roomUid: string) {
    this.joinRoom.emit(roomUid);
  }

  onDeleteRoom(roomUid: string) {
    this.deleteRoom.emit(roomUid);
  }

  onCreateRoom() {
    this.createRoom.emit();
  }

  onInvitePlayer(roomKey: string) {
    this.invitePleyer.emit(roomKey)
  }
}