import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RoomsPlayers } from "app/app.state";

@Component({
  selector: "app-rooms-dialog",
  templateUrl: "./rooms-dialog.component.html",
  styleUrls: ["./rooms-dialog.component.css"],
})
export class RoomsDialogComponent {
  @Input() rooms: RoomsPlayers[]
  @Input() userRoomUid: string;
  @Input() hasRoom: boolean;


  @Output() closeRooms = new EventEmitter()
  @Output() createRoom = new EventEmitter()
  @Output() invitePleyer = new EventEmitter()
  @Output() joinRoom = new EventEmitter()
  @Output() deleteRoom = new EventEmitter()

  onCloseRooms() {
    this.closeRooms.emit()
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