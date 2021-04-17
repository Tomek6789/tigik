import { Clipboard } from "@angular/cdk/clipboard";
import { Component, EventEmitter, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, UrlSerializer } from "@angular/router";
import { User } from "app/auth/user.model";
import { Room, RoomsService } from "app/services/rooms.service";
import { SnackBarService } from "app/services/snackbar.service";
import { UserService } from "app/services/users.service";
import { Subject } from "rxjs";
import { filter, pluck, take } from "rxjs/operators";

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
  user$ = this.userService.user$;

  hasRoom$ = this.user$.pipe(
    pluck("room"),
  );

  private destroy$ = new Subject();

  constructor(
    private router: Router,
    private serializer: UrlSerializer,
    private snackBarService: SnackBarService,
    public dialog: MatDialog,
    private clipboard: Clipboard,
    private roomsService: RoomsService,
    private userService: UserService
  ) { }


  getPlayer(uid: string) {
    return this.userService.onUserStateChanged(uid)
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onCreateRoom() {
    this.user$
      .pipe(
        take(1),
        // filter((user) => this.validateUser(user))
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
        this.roomsService.joinRoom(roomKey, user.uid);
        this.userService.updateRoomAndRole(roomKey, "guest");
      });
  }

  onInvitePlayer(roomKey: string) {
    const tree = this.router.createUrlTree([], { queryParams: { room: roomKey } });

    this.clipboard.copy(`http://localhost:4200${this.serializer.serialize(tree)}`);
    this.snackBarService.openSnackBar("Send this link to your friend");
  }

  private validateUser(user: User): boolean {
    if (!user) {
      this.snackBarService.openSnackBar("Login or play as guest");
      return false;
    }
    if (user.roomUid) {
      this.snackBarService.openSnackBar(
        "You already have room, invite someone to play with you"
      );
      return false;
    }
    return true;
  }
}
