import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, pluck, shareReplay, switchMap, take, tap } from "rxjs/operators";
import { DialogService } from "./dialogs/dialog.service";
import { Element } from "./models/element";
import { LotteryService } from "./services/lottery.service";
import { PeriodicTableService } from "./services/periodic-table.service";
import { RoomsService } from "./services/rooms.service";
import { UserService } from "./services/users.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  searchingElement: string;
  table$: Observable<Element[]> = this.periodicTableService.getPeriodicTable();
  level$ = new BehaviorSubject("One");

  rooms$ = this.roomsService.rooms$;

  isLogin$ = this.userService.authUserUid$.pipe(map(Boolean))
  user$ = this.userService.user$



  myRoom$ = this.user$.pipe(
    filter((user) => Boolean(user.roomUid)),

    switchMap(user => this.roomsService.onMyRoomStateChanged(user.roomUid, user.uid)))
  startGame$ = this.myRoom$.pipe(
    pluck("startGame"),
    shareReplay(1))

  periodicTableRoom$ = this.myRoom$.pipe(
    map(({ startGame, searchingElement }) => ({ startGame, searchingElement }))
  );

  score$ = this.myRoom$.pipe(pluck('score'))





  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event) {
    this.user$.pipe(take(1)).subscribe((user) => {
      this.userService.updateRoomAndRole(null, null);
      this.roomsService.removeRoom(user.roomUid);
      const role = user.role === "host" ? "hostUserUid" : "guestUserUid";
      this.roomsService.removeUserFromRoom(user.roomUid, role);
    });
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private periodicTableService: PeriodicTableService,
    private userService: UserService,
    private roomsService: RoomsService,
    private lotteryService: LotteryService,

    private dialogService: DialogService
  ) { }

  hostPlayer$ = this.myRoom$.pipe(
    switchMap((myRoom) => this.userService.onUserStateChanged(myRoom.hostUserUid))
  );

  guestPlayer$ = this.myRoom$.pipe(
    filter((room) => Boolean(room.guestUserUid)),
    switchMap(({ guestUserUid }) => this.userService.onUserStateChanged(guestUserUid))
  );

  ngOnInit() {
    // Start App
    this.userService.userApp$.subscribe();


    this.activatedRoute.queryParams.pipe(map(a => a.room), filter<string>(Boolean)).subscribe(roomUid => {
      this.user$.pipe(filter<any>(Boolean)).subscribe(u => {
        this.userService.updateRoomAndRole(roomUid, 'guest')
        this.roomsService.joinRoom(roomUid, u.uid)
      })
    });


  }

  handleFinish() {
    this.user$.pipe(take(1)).subscribe(({ roomUid, score, bestScore = 0 }) => {
      this.roomsService.startGame(roomUid, false, null);

      if (score >= bestScore) {
        this.userService.updateBestScore(score);
      }
      this.userService.updateScore(0)
    });

  }

  handleSelected(symbol: string) {
    if (symbol === this.searchingElement) {
      this.user$.pipe(take(1)).subscribe(({ roomUid, score }) => {
        this.roomsService.searchingElement(roomUid, this.randomElement(score));
        this.userService.updateScore(score += 10);
        this.level$.next("a");
      });
    }
  }


  startGame() {
    this.user$.pipe(tap(console.log), take(1)).subscribe((user) => {
      let roomUid = user.roomUid;
      if (!user.roomUid) {
        const room = this.roomsService.createRoom(user.uid)
        roomUid = room.key
        this.userService.updateRoomAndRole(roomUid, 'host')
      }


      this.roomsService.startGame(roomUid, true, this.randomElement(0));
    });
  }

  private randomElement(score: number): string {
    this.searchingElement = this.lotteryService.drawElement(score);
    return this.searchingElement
  }

  showRooms() {
    this.dialogService.openRoomsDialog();
  }
}
