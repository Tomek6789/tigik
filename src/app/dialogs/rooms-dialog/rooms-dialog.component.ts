import { Component, EventEmitter, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { User } from "app/auth/user.model";
import { Room, RoomsService } from "app/services/rooms.service";
import { SnackBarService } from "app/services/snackbar.service";
import { UserService } from "app/services/users.service";
import { Subject } from "rxjs";
import { filter, takeUntil, take, pluck, tap } from "rxjs/operators";
import { Clipboard } from "@angular/cdk/clipboard";

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
export class RoomsDialogComponent implements OnDestroy {
  actions = new EventEmitter<Actions>();

  rooms$ = this.roomsService.rooms$;
  user$ = this.userService.userData$;
  hasRoom$ = this.user$.pipe(
    pluck("room"),
    tap((a) => console.log("HAS ROOM", a))
  );

  private destroy$ = new Subject();

  constructor(
    private snackBarService: SnackBarService,
    public dialog: MatDialog,
    private clipboard: Clipboard,
    private roomsService: RoomsService,
    private userService: UserService
  ) {}

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onCreateRoom() {
    this.user$
      .pipe(
        take(1),
        filter((user) => this.validateUser(user))
      )
      .subscribe((user) => {
        const room = this.roomsService.createRoom(user.uid);
        this.userService.updateRoomAndRole(room.key, "host");
      });
  }

  onDeleteRoom(roomKey: string) {
    this.userService.updateRoomAndRole(null, null);
    this.roomsService.removeRoom(roomKey);
  }

  onJoinRoom(roomKey: string, user: User) {
    this.user$
      .pipe(
        take(1),
        filter((user) => this.validateUser(user))
      )
      .subscribe((user) => {
        console.log("JOIN SUB");
        this.roomsService.joinRoom(roomKey, user.uid);
        this.userService.updateRoomAndRole(roomKey, "guest");
      });
  }

  onInvitePlayer(roomKey: string) {
    this.clipboard.copy(`https://chemgame.pl/room=${roomKey}`);
    this.snackBarService.openSnackBar("Send this link to your friend");
  }

  private validateUser(user: User): boolean {
    if (!user) {
      this.snackBarService.openSnackBar("Login or play as guest");
      return false;
    }
    if (user.room) {
      this.snackBarService.openSnackBar(
        "You already have room, invite someone to play with you"
      );
      return false;
    }
    return true;
  }

  // onJoinRoom(key: string) {
  //   this.actions.emit({
  //     key,
  //     type: ActionsTypes.JOIN,
  //   });
  // }

  // onDeleteRoom(key: string) {
  //   this.actions.emit({
  //     key,
  //     type: ActionsTypes.DELETE,
  //   });
  // }

  onStartGame() {
    this.actions.emit({
      type: ActionsTypes.START,
    });
  }

  invitePlayer(key: string) {}
}
