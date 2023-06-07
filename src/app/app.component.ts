import { Clipboard } from "@angular/cdk/clipboard";
import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router, UrlSerializer } from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest, Subject, from, iif } from "rxjs";
import { filter, map, pluck, startWith, switchMap, take, tap, withLatestFrom } from "rxjs/operators";
import { AppState } from "./app.state";
import { SnackBarService } from "./services/snackbar.service";
import { UserService } from "./services/users.service";
import { finishGame, getRoom, playerLeaveRoom, selectedElement, startGame } from "./store/room/room.actions";
import { getLoginHostUser, userIsLogIn, signInUser, signOutUser,  inviteOpponent, removeOpponent, getLoginGuestUser, signForGuest } from "./store/user/user.actions";

import UserState, { usersFeatureKey} from './store/user/user.reducer'
import { isAnonymousSelector, isUserLoginSelector, opponentSelector, roomUidSelector, showInviteSelector, userRoleSelector, userSelector } from "./store/user/user.selectors";
import { searchingElementSelector, startGameSelector } from "./store/room/room.selectors";

interface State {
  [usersFeatureKey]: UserState
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  table$ = this.appState.table$;
  // user
  isLogin$ = this.store.select(isUserLoginSelector)
  isAnonymous$ = this.store.select(isAnonymousSelector)
  user$ = this.store.select(userSelector)

  // room
  startGame$ = this.store.select(startGameSelector)
  searchingElementChanged$ = this.store.select(searchingElementSelector);
  opponentPlayer$ = this.store.select(opponentSelector);
  showInvite$ = this.store.select(showInviteSelector);
  roomUid$ = this.store.select(roomUidSelector);


  @HostListener('window:beforeunload')
  beforeUnloadHandler() {
      this.store.dispatch(playerLeaveRoom())
  }

  constructor(
    private appState: AppState,
    public userService: UserService,
    private snackBarService: SnackBarService,
    private router: Router,
    private serializer: UrlSerializer,
    private clipboard: Clipboard,

    private store: Store<State>
  ) {   }

  ngOnInit() {

    const roomUid = window.location.href.split('=')[1];
    console.log(roomUid)
    if(roomUid) {
      console.log('GUEST')
      this.store.dispatch(signForGuest({ roomUid }))
      this.store.dispatch(getLoginGuestUser({ roomUid }))
    } else {
      console.log('HOST')
      this.store.dispatch(getLoginHostUser())
    }

    // this.inviteRoomUid$.subscribe((roomUid) => {
      // console.log('app component', roomUid )
      // this.store.dispatch(getLoginUser({ roomUid }))

      // this.store.dispatch(inviteOpponent({ roomUid }))
    // });

    // combineLatest(this.roomUid$.pipe(filter<string>(Boolean)), this.inviteRoomUid$).pipe(
    //   // filter(([roomUid, role]) => role === '')
    // ).subscribe(([roomUid, routeRoomUid]) => {
    //   console.log(roomUid)
    //         if(routeRoomUid !== roomUid) {
              
    //   console.log('GET NEW ROOM UID') 
    //   this.store.dispatch(removeOpponent()) // from old room
    //   this.store.dispatch(getOpponent())
    //   this.store.dispatch(getRoom())

    //           console.log('GUEST BECOME HOST')
    //           this.router.navigate(
    //             [], 
    //             {
    //               // relativeTo: this.activatedRoute,
    //               queryParams: { room: null },
    //               // queryParamsHandling: 'merge'
    //             }
    //             )
    //           }
    // })
  }

  handleFinish() {
    this.store.dispatch(finishGame())
  }

  handleSelected(symbol: string) {
    this.store.dispatch(selectedElement({selectedElement: symbol}))
  }

 onSingIn() {
   this.store.dispatch(signInUser())     
  }

  onSignOut() {
    this.store.dispatch(signOutUser())
  }

  startGame() {
    this.store.dispatch(startGame())
  }


  test() {
    // this.store.dispatch(userLeaveRoom())

  }

  onInvitePlayer() {
    
    this.store.select(roomUidSelector).pipe(
      tap((roomUid) => {
        const tree = this.router.createUrlTree([], { queryParams: { room: roomUid } });
        
        
        this.clipboard.copy(`http://localhost:4200${this.serializer.serialize(tree)}`);
        this.snackBarService.openSnackBar("Send this link to your friend");
        
        
              })
            ).subscribe()
  }
}

