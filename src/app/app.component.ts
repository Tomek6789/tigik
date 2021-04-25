import { Clipboard } from "@angular/cdk/clipboard";
import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router, UrlSerializer } from "@angular/router";
import { combineLatest, Subject } from "rxjs";
import { filter, map, startWith, take, tap, withLatestFrom } from "rxjs/operators";
import { AppState } from "./app.state";
import { User } from "./auth/user.model";
import { DialogService } from "./dialogs/dialog.service";
import { LotteryService } from "./services/lottery.service";
import { RoomsService } from "./services/rooms.service";
import { SnackBarService } from "./services/snackbar.service";
import { UserService } from "./services/users.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  userSelectedElementSubject = new Subject<string>()
  periodicTableRoom$ = this.appState.periodicTableRoom$
  table$ = this.appState.table$;
  inviteRoomUid$ = this.activatedRoute.queryParams.pipe(map(a => a.room), filter<string>(Boolean))
  //user
  isLogin$ = this.appState.isLogin$
  user$ = this.appState.user$
  userUid$ = this.appState.userUid$;
  userRoom$ = this.appState.userRoom$
  userRoomUid$ = this.appState.userRoomUid$;
  hasRoom$ = this.appState.hasRoom$
  role$ = this.appState.role$;
  score$ = this.appState.score$;
  isBestScore$ = this.appState.isBestScore$;


  //room
  rooms$ = this.appState.rooms$;
  startGame$ = this.appState.startGame$
  playersInRooms$ = this.appState.playersInRooms$
  hostPlayer$ = this.appState.hostPlayer$;
  guestPlayer$ = this.appState.guestPlayer$;
  searchingElementChanged$ = this.appState.searchingElementChanged$;


  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event) {
    combineLatest([
      this.userRoomUid$,
      this.role$
    ]).subscribe(([roomUid, role]) => {
      this.userService.updateRoomAndRole(null, null);
      this.roomsService.removeRoom(roomUid);
      this.roomsService.removeUserFromRoom(roomUid, `${role}Uid`);
    });
  }

  constructor(
    private appState: AppState,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private roomsService: RoomsService,
    private lotteryService: LotteryService,
    private snackBarService: SnackBarService,
    private dialogService: DialogService,
    private router: Router,
    private serializer: UrlSerializer,
    private clipboard: Clipboard,
  ) { }

  ngOnInit() {
    // Start App
    this.userService.userApp$.subscribe();

    combineLatest([this.inviteRoomUid$, this.userUid$]).subscribe(([roomUid, uid]) => {
      this.userService.updateRoomAndRole(roomUid, 'guest')
      this.roomsService.joinRoom(roomUid, uid)
    });

    //game
    this.userSelectedElementSubject.asObservable().pipe(
      withLatestFrom(combineLatest([
        this.searchingElementChanged$,
        this.score$.pipe(startWith(null)),
        this.userRoomUid$
      ])),
      filter(([userSelectedElement, [roomElement]]) => userSelectedElement === roomElement),
      tap(([userSelectedElement, [a, score, userRoomUid]]) => {
        this.roomsService.searchingElement(userRoomUid, this.randomElement(score));
        this.userService.updateScore(score += 10);

      })
    ).subscribe()
  }

  handleFinish() {
    this.userRoomUid$.pipe(take(1)).subscribe(roomUid => {
      this.roomsService.startGame(roomUid, false, null);
      this.userService.updateScore(0);
    })

    this.isBestScore$.subscribe(bestScore => {
      this.userService.updateBestScore(bestScore)
    })
  }

  handleSelected(symbol: string) {
    this.userSelectedElementSubject.next(symbol)
  }


  startGame() {
    this.user$.pipe(take(1)).subscribe((user) => {
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
    return this.lotteryService.drawElement(score)
  }

  showRooms() {
    this.dialogService.openRoomsDialog();
  }

  onCreateRoom() {
    this.user$
      .pipe(
        take(1),
      )
      .subscribe((user) => {
        const room = this.roomsService.createRoom(user.uid);
        this.userService.updateRoomAndRole(room.key, "host");
      });
  }

  onInvitePlayer(roomKey: string) {
    console.log(roomKey)
    const tree = this.router.createUrlTree([], { queryParams: { room: roomKey } });

    this.clipboard.copy(`http://localhost:4200${this.serializer.serialize(tree)}`);
    this.snackBarService.openSnackBar("Send this link to your friend");
  }

  onDeleteRoom(roomKey: string) {
    this.userService.updateRoomAndRole(null, null);
    this.roomsService.removeRoom(roomKey);
  }

  onJoinRoom(roomKey: string) {
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

  private validateUser(user: User): boolean {
    if (!user) {
      this.snackBarService.openSnackBar("Login or play as guest");
      return false;
    }
    return true;
  }
}

