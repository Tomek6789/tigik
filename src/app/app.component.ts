import { Clipboard } from "@angular/cdk/clipboard";
import { Component, HostListener, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router, UrlSerializer } from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest, Subject, from, iif } from "rxjs";
import {
  filter,
  map,
  pluck,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { SnackBarService } from "./services/snackbar.service";
import { UserService } from "./services/users.service";
import {
  finishGame,
  listenRoomRemoved,
  playerLeaveRoom,
  selectedElement,
  startGame,
} from "./store/room/room.actions";
import {
  getLoginUser,
  userIsLogIn,
  signInUser,
  signOutUser,
  signForGuest,
} from "./store/user/user.actions";

import UserState, { usersFeatureKey } from "./store/user/user.reducer";
import {
  isAnonymousSelector,
  isUserLoginSelector,
  opponentSelector,
  roomUidSelector,
  showInviteSelector,
  userSelector,
} from "./store/user/user.selectors";
import {
  animateElementSelector,
  searchingElementSelector,
  startGameSelector,
} from "./store/room/room.selectors";

import { HttpClient } from "@angular/common/http";
import { PeriodicTableService } from "./services/periodic-table.service";

interface State {
  [usersFeatureKey]: UserState;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  table$ = this.periodicTableService.getPeriodicTable();
  animate$ = this.store.select(animateElementSelector);
  // user
  isLogin$ = this.store.select(isUserLoginSelector);
  isAnonymous$ = this.store.select(isAnonymousSelector);
  user$ = this.store.select(userSelector);

  // room
  startGame$ = this.store.select(startGameSelector);
  searchingElementChanged$ = this.store.select(searchingElementSelector);
  opponentPlayer$ = this.store.select(opponentSelector);
  showInvite$ = this.store.select(showInviteSelector);
  roomUid$ = this.store.select(roomUidSelector);

  http = inject(HttpClient);

  @HostListener("window:beforeunload")
  beforeUnloadHandler() {
    this.store.dispatch(playerLeaveRoom());
  }

  constructor(
    public userService: UserService,
    private snackBarService: SnackBarService,
    private router: Router,
    private periodicTableService: PeriodicTableService,
    private serializer: UrlSerializer,
    private clipboard: Clipboard,

    private store: Store<State>
  ) {}

  ngOnInit() {
    const roomUid = window.location.href.split("=")[1];
    this.store.dispatch(getLoginUser({ roomUid }));

    //listen for room removed when host leave a room
    this.store.dispatch(listenRoomRemoved())
  }

  handleFinish() {
    this.store.dispatch(finishGame());
  }

  handleSelected(symbol: string) {
    this.store.dispatch(selectedElement({ selectedElement: symbol }));
  }

  onSingIn() {
    this.store.dispatch(signInUser());
  }

  onSignOut() {
    this.store.dispatch(signOutUser());
  }

  startGame() {
    this.store.dispatch(startGame());
  }

  onInvitePlayer() {
    this.store
      .select(roomUidSelector)
      .pipe(
        tap((roomUid) => {
          const tree = this.router.createUrlTree([], {
            queryParams: { room: roomUid },
          });

          this.clipboard.copy(
            `http://localhost:4200${this.serializer.serialize(tree)}`
          );
          this.snackBarService.openSnackBar("Send this link to your friend");
        })
      )
      .subscribe();
  }
}
