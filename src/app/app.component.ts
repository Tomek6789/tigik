import { Clipboard } from "@angular/cdk/clipboard";
import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router, UrlSerializer } from "@angular/router";
import { Store } from "@ngrx/store";
import { take, tap } from "rxjs/operators";
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
  userIsLogOut,
  updateIsLogin,
  removeRoomUid,
} from "./store/user/user.actions";

import UserState, { usersFeatureKey } from "./store/user/user.reducer";
import {
  isAnonymousSelector,
  isUserLoginSelector,
  opponentSelector,
  roomUidSelector,
  showInviteSelector,
  userSelector,
  userUidSelector,
} from "./store/user/user.selectors";
import {
  animateElementSelector,
  isSinglePlayerModeSelector,
  resetProgressBarSelector,
  searchingElementSelector,
  startGameSelector,
  winnerUidSelector,
} from "./store/room/room.selectors";

import { HttpClient } from "@angular/common/http";
import { PeriodicTableService } from "./services/periodic-table.service";
import { Overlay, OverlayConfig, OverlayContainer } from "@angular/cdk/overlay";
import { CdkPortal, ComponentPortal } from "@angular/cdk/portal";
import { UserProfileComponent } from "./auth/user-profile/user-profile.component";
import { MenuComponent } from "./components/menu/menu.component";

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
  userUid$ = this.store.select(userUidSelector);

  // room
  startGame$ = this.store.select(startGameSelector);
  searchingElementChanged$ = this.store.select(searchingElementSelector);
  resetProgressBar$ = this.store.select(resetProgressBarSelector);
  opponentPlayer$ = this.store.select(opponentSelector);
  showInvite$ = this.store.select(showInviteSelector);
  roomUid$ = this.store.select(roomUidSelector);
  winnerUid$ = this.store.select(winnerUidSelector);
  isSinglePlayerMode$ = this.store.select(isSinglePlayerModeSelector);

  http = inject(HttpClient);

  @HostListener("window:beforeunload")
  beforeUnloadHandler() {
    this.userUid$.pipe(take(1)).subscribe((userUid) => {
      this.store.dispatch(removeRoomUid({ userUid }));
      this.store.dispatch(updateIsLogin({ userUid, isLogin: false }));
      this.store.dispatch(playerLeaveRoom());
    });
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
    this.store.dispatch(listenRoomRemoved());
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
            `https://chemgame.pl${this.serializer.serialize(tree)}`
          );
          this.snackBarService.openSnackBar("Send this link to your friend");
        })
      )
      .subscribe();
  }
}
