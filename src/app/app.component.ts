import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, pluck, shareReplay, switchMap, take } from "rxjs/operators";
import { User } from "./auth/user.model";
import { DialogService } from "./dialogs/dialog.service";
import { Element } from "./models/element";
import { LotteryService } from "./services/lottery.service";
import { PeriodicTableService } from "./services/periodic-table.service";
import { Room, RoomsService } from "./services/rooms.service";
import { SnackBarService } from "./services/snackbar.service";
import { UserService } from "./services/users.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  table$: Observable<Element[]> = this.periodicTableService.getPeriodicTable();

  symbol: string;

  state = {
    bestScore: 0,
    score: 0,
  };

  level$ = new BehaviorSubject("One");
  searchingElement: string;

  userData$ = this.userService.userData$;
  hasRoom$ = this.userData$.pipe(pluck("room"));

  rooms$ = this.roomsService.rooms$;
  myRoom$ = this.roomsService.myRoom$;
  startGame$ = this.myRoom$.pipe(pluck("startGame"), shareReplay(1));
  periodicTableRoom$ = this.myRoom$.pipe(
    map(({ startGame, searchingElement }) => ({ startGame, searchingElement }))
  );

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event) {
    this.userService.updateRoomAndRole(null, null);
    this.userService.deleteVisitor();
    this.userData$.pipe(take(1)).subscribe((user) => {
      this.roomsService.removeRoom(user.room);
      const role = user.role === "host" ? "hostUserUid" : "guestUserUid";
      this.roomsService.removeUserFromRoom(user.room, role);
    });
  }

  constructor(
    private periodicTableService: PeriodicTableService,
    private userService: UserService,
    private roomsService: RoomsService,
    private lotteryService: LotteryService,
    private snackBarService: SnackBarService,

    private dialogService: DialogService
  ) {
    this.hasRoom$.subscribe((room) => {
      console.log("ROOOM", room);
    });

    this.myRoom$.subscribe(({ searchingElement, startGame }) => {
      // TO DO: Unsubscribe

      this.searchingElement = searchingElement;
      this.level$.next("a");

      if (startGame) {
        this.dialogService.closeDialog();
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
    // TO DO: Unsubscribe
    this.userService.userApp$.subscribe();

    this.playAsGuest();
  }

  handleFinish() {
    this.userData$.pipe(take(1)).subscribe(({ room }) => {
      this.roomsService.startGame(room, false, this.searchingElement);
      this.userService.updateBestScore(this.state.score);
    });

    if (this.state.score >= this.state.bestScore) {
      this.state.bestScore = this.state.score;
    }
    this.state.score = 0;
  }

  handleSelected(symbol: string) {
    this.symbol = symbol;

    if (this.symbol === this.searchingElement) {
      this.state.score += 10;

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
  }

  private randomElement(): string {
    return this.lotteryService.drawElement(this.state.score);
  }

  playAsGuest() {
    this.dialogService.openWelcomDialog();
  }

  showRooms() {
    this.dialogService.openRoomsDialog();
  }
}
