import { Clipboard } from "@angular/cdk/clipboard";
import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import {
  filter,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";
import { BehaviorSubject } from "rxjs/Rx";
import { User } from "./auth/user.model";
import { DialogService } from "./dialogs/dialog.service";
import { ActionsTypes } from "./dialogs/rooms-dialog/rooms-dialog.component";
import { LotteryService } from "./lottery.service";
import { Element } from "./models/element";
import { PeriodicTableService } from "./periodic-table.service";
import { Room, RoomsService } from "./rooms/rooms.service";
import { SnackBarService } from "./snackbar/snackbar.service";
import { UserService } from "./users/users.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  table: Element[];
  symbol: string;

  state = {
    start: false,
    bestScore: 0,
    score: 0,
  };

  level$ = new BehaviorSubject("One");
  searchingElement: string;

  userData$ = this.userService.userData$;
  rooms$ = this.roomsService.rooms$;
  myRoom$ = this.roomsService.myRoom$;

  roomsDialog: any;

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event) {
    this.userService.updateRoomAndRole(null, null);
    console.log("DELETE VISITORs");
    this.userService.deleteVisitor();
    this.userData$.pipe(take(1)).subscribe((user) => {
      if (user && user.room) {
        if (user.role === "host") {
          this.roomsService.removeRoom(user.room);
        } else {
          this.roomsService.removeGuestFromRoom(user.room);
        }
      }
    });
  }

  ngOnDestroy() {}

  constructor(
    private periodicTableService: PeriodicTableService,
    private userService: UserService,
    private roomsService: RoomsService,
    private lotteryService: LotteryService,
    private snackBarService: SnackBarService,
    private clipboard: Clipboard,
    private dialogService: DialogService
  ) {
    this.myRoom$.subscribe(({ searchingElement, startGame }) => {
      // TO DO: Unsubscribe
      this.searchingElement = searchingElement;
      this.level$.next("a");

      console.log(startGame);
      if (startGame) {
        this.roomsDialog.close();
      }
    });
  }

  hostPlayer$ = this.myRoom$.pipe(
    switchMap<Room, Observable<User>>((myRoom) => {
      return this.userService.getUser(myRoom.hostUserUid);
    })
  );
  guestPlayer$ = this.myRoom$.pipe(
    switchMap<Room, Observable<Partial<User>>>(({ guestUserUid }) => {
      if (!guestUserUid) {
        return of({
          displayName: "trol",
          score: -10,
        });
      }

      return this.userService.getUser(guestUserUid);
    })
  );

  ngOnInit() {
    this.periodicTableService
      .getPeriodicTable()
      .subscribe((data: Element[]) => {
        this.table = data;
      });

    // TO DO: Unsubscribe
    this.userService.userApp$.subscribe();

    this.playAsGuest();
  }

  private createRoom(user: User) {
    if (!user) {
      this.snackBarService.openSnackBar("Login or play as guest");
      return;
    }
    if (user.room) {
      this.snackBarService.openSnackBar(
        "You already have room, invite someone to play with you"
      );
      return;
    }
    const room = this.roomsService.createRoom(user.uid, user.displayName);
    this.userService.updateRoomAndRole(room.key, "host");
  }

  private joinRoom(roomKey: string, user: User) {
    if (user.room) {
      this.snackBarService.openSnackBar(
        "You already have room, invite someone to play with you"
      );
      return;
    }
    this.roomsService.joinRoom(roomKey, user.uid);
    this.userService.updateRoomAndRole(roomKey, "guest");
  }

  invitePlayer(roomKey: string) {
    this.clipboard.copy(`https://chemgame.pl/room=${roomKey}`);
    this.snackBarService.openSnackBar("Send this link to your friend");
  }

  handleFinish(finish) {
    this.userData$.pipe(take(1)).subscribe(({ room }) => {
      this.roomsService.startGame(room, false, this.searchingElement);
      this.userService.updateBestScore(this.state.score);
    });

    this.state.start = finish;
    if (this.state.score >= this.state.bestScore) {
      this.state.bestScore = this.state.score;
    }
    this.state.score = 0;
  }

  handleSelected(symbol: string) {
    this.symbol = symbol;

    if (this.symbol === this.searchingElement) {
      this.state.score += 10;
      this.userService.updateElement(symbol);

      this.userData$.pipe(take(1)).subscribe(({ room }) => {
        this.searchingElement = this.randomElement();
        this.roomsService.searchingElement(room, this.searchingElement);
        this.userService.updateScore(this.state.score);
      });
    }
  }

  startGame() {
    this.searchingElement = this.randomElement();

    this.userData$.pipe(take(1)).subscribe((user) => {
      if (!user) {
        this.snackBarService.openSnackBar("Please login or play as guest");
        return;
      }
      this.roomsService.startGame(user.room, true, this.searchingElement);
    });
    console.log("START GAME");
    this.state.start = true;
  }

  private randomElement(): string {
    return this.lotteryService.drawElement(this.state.score);
  }

  removeRoom(roomKey: string) {
    this.userService.updateRoomAndRole(null, null);
    this.roomsService.removeRoom(roomKey);
  }

  playAsGuest() {
    const dialogRef = this.dialogService.openWelcomDialog();
    dialogRef
      .afterClosed()
      .pipe(filter(Boolean), take(1))
      .subscribe((result) => {
        this.userService.createVisitor(result as string);
        this.showRooms();
      });
  }

  showRooms() {
    this.roomsDialog = this.dialogService.openRoomsDialog(this.rooms$);

    this.roomsDialog.componentInstance.actions
      .pipe(
        withLatestFrom(this.userData$),
        takeUntil(this.roomsDialog.afterClosed())
      )
      .subscribe(([{ key, type }, user]) => {
        switch (type) {
          case ActionsTypes.CREATE:
            this.createRoom(user);
            return;
          case ActionsTypes.JOIN:
            this.joinRoom(key, user);
            return;
          case ActionsTypes.DELETE:
            if (user.room !== key) {
              this.snackBarService.openSnackBar(
                "You can delete only your own room"
              );
              return;
            }
            this.removeRoom(key);
            return;
          case ActionsTypes.START:
            this.startGame();
          default:
            return;
        }
      });
  }
}
