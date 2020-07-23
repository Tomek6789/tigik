import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { Observable, of } from "rxjs";
import { filter, take } from "rxjs/operators";
import { BehaviorSubject } from "rxjs/Rx";
import { User } from "./auth/user.model";
import { LotteryService } from "./lottery.service";
import { Element } from "./models/element";
import { PeriodicTableService } from "./periodic-table.service";
import { RoomsService } from "./rooms/rooms.service";
import { UserService } from "./users/users.service";
import { SnackBarService } from "./snackbar/snackbar.service";

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

  @HostListener("window:unload", ["$event"])
  unloadHandler(event) {
    this.userService.deleteVisitor();
    this.userData$.pipe(take(1)).subscribe((user) => {
      if (user.role === "host") {
        this.roomsService.removeRoom(user.room);
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
    private clipboard: Clipboard
  ) {
    this.myRoom$.subscribe(({ searchingElement, startGame }) => {
      // TO DO: Unsubscribe
      this.searchingElement = searchingElement;
      this.level$.next("a");
    });
  }

  storeToDB() {
    this.userService.updateScore(this.state.score);
  }

  createRoom() {
    this.userData$.pipe(take(1)).subscribe((user) => {
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
      const room = this.roomsService.createRoom(user);
      this.userService.updateRoomAndRole(room.key, "host");
    });
  }

  joinRoom(roomKey: string) {
    this.roomsService.joinRoom(roomKey);
    this.userService.updateRoomAndRole(roomKey, "guest");
  }

  invitePlayer(roomKey: string) {
    this.clipboard.copy("text");
    this.snackBarService.openSnackBar("Send this link to your friend");
  }

  handleFinish(finish) {
    this.userData$.pipe(take(1)).subscribe(({ room }) => {
      this.roomsService.startGame(room, false, this.searchingElement);
    });

    this.state.start = finish;
    if (this.state.score >= this.state.bestScore) {
      this.state.bestScore = this.state.score;
    }
    this.state.score = 0;
  }

  ngOnInit() {
    this.periodicTableService
      .getPeriodicTable()
      .subscribe((data: Element[]) => {
        this.table = data;
      });

    // TO DO: Unsubscribe
    this.userService.userApp$.subscribe();
  }

  handleSelected(symbol: string) {
    this.symbol = symbol;

    if (this.symbol === this.searchingElement) {
      this.state.score += 10;
      this.userService.updateElement(symbol);

      this.userData$.pipe(take(1)).subscribe(({ room }) => {
        this.searchingElement = this.randomElement();
        this.roomsService.searchingElement(room, this.searchingElement);
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
    this.state.start = true;
  }

  get isPlaying(): Observable<boolean> {
    return of(true);
    // return combineLatest(this.myRoom$, this.userData$).pipe(
    //   map(([{ player, startGame }, { role }]) => startGame && player !== role)
    // );
  }

  get showActive(): Observable<boolean> {
    return of(true);
    // return combineLatest(this.myRoom$, this.userData$).pipe(
    //   take(1),
    //   map(([{ player }]) => player === "host")
    // );
  }

  private randomElement(): string {
    return this.lotteryService.drawElement(this.state.score);
  }

  playAsVisitor() {
    this.userService.createVisitor();
  }

  removeRoom(roomKey: string) {
    return this.roomsService.removeRoom(roomKey);
  }
}
