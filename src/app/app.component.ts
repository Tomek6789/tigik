import { Clipboard } from "@angular/cdk/clipboard";
import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router, UrlSerializer } from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest, Subject, from, iif } from "rxjs";
import { filter, map, pluck, startWith, switchMap, take, tap, withLatestFrom } from "rxjs/operators";
import { AppState } from "./app.state";
import { AuthService } from "./auth/auth.service";
import { User } from "./auth/user.model";
import { DialogService } from "./dialogs/dialog.service";
import { LotteryService } from "./services/lottery.service";
import { RoomsService } from "./services/rooms.service";
import { SnackBarService } from "./services/snackbar.service";
import { UserService } from "./services/users.service";
import { selectedElement, startGame } from "./store/room/room.actions";
import { getLoginUser, signInUser } from "./store/user/user.actions";

import { userFeatureKey, UserState} from './store/user/user.reducer'
import { isUserLoginSelector } from "./store/user/user.selectors";

interface State {
  [userFeatureKey]: UserState
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  userSelectedElementSubject = new Subject<string>()
  // periodicTableRoom$ = this.appState.periodicTableRoom$
  table$ = this.appState.table$;
  inviteRoomUid$ = this.activatedRoute.queryParams.pipe(map(a => a.room), filter<string>(Boolean))
  // user
  isLogin$ = this.store.select(isUserLoginSelector)
  user$ = this.appState.user$
  userUid$ = this.appState.userUid$;
  userRoomUid$ = this.appState.userRoomUid$;
  hasRoom$ = this.appState.hasRoom$
  role$ = this.appState.role$;
  score$ = this.appState.score$;
  isBestScore$ = this.appState.isBestScore$;


  // room
  startGame$ = this.appState.startGame$
  searchingElementChanged$ = this.appState.searchingElementChanged$;
  opponentPlayer$ = this.appState.opponentPlayer$;


  constructor(
    private appState: AppState,
    private activatedRoute: ActivatedRoute,
    public userService: UserService,
    private roomsService: RoomsService,
    private snackBarService: SnackBarService,
    private router: Router,
    private serializer: UrlSerializer,
    private clipboard: Clipboard,
    private auth: AuthService,

    private store: Store<State>
  ) { 
    console.log('constr app')
  }

  ngOnInit() {

    this.store.dispatch(getLoginUser())

    combineLatest([this.inviteRoomUid$, this.userUid$]).subscribe(([roomUid, uid]) => {
      // this.userService.updateRoomAndRole(roomUid, 'guest')
      // this.roomsService.joinRoom(roomUid, uid)
    });

    //game
    this.userSelectedElementSubject.asObservable().pipe(
      withLatestFrom(combineLatest([
        this.searchingElementChanged$,
        this.score$.pipe(startWith(null)),
      ])),
      filter(([userSelectedElement, [roomElement]]) => userSelectedElement === roomElement),
      tap(([userSelectedElement, [a, score]]) => {
        // this.appState.game(score)
      })
    ).subscribe()
  }

  handleFinish() {

    //   this.roomsService.startGame(this.userService.user.roomUid, false, null);
    //   this.userService.updateScore(0);

    // this.isBestScore$.pipe(take(1)).subscribe(bestScore => {
    //   // this.userService.updateBestScore(bestScore)
    // })
  }

  handleSelected(symbol: string) {
    this.store.dispatch(selectedElement({selectedElement: symbol}))
    // this.userSelectedElementSubject.next(symbol)
  }

 onSingIn() {
   this.store.dispatch(signInUser())     
  }

  onSignOut() {
    this.auth.signOut()
  }





  async startGame() {
    this.store.dispatch(startGame())

//     if(this.userService.isLogin) {

//       console.log('Start game for login user')
//       this.appState.startGame()
//       } else {
// console.log('Start game for annoynomous user')

//         // loginAnnonumous = action
//         // auth.effect - annonymus -> set user -> triger create room
//         // room.effect -

//        await this.auth.annonymus()
       
//       //  .then((user) => {
//       //   // console.log(user)
//       //   console.log('then', user)
//       //    this.appState.createRoomUpdateUserRoomAndRoleAndStartGame()
//       //  })

      
//     }

 
      

  }



  onInvitePlayer() {
    
        // const tree = this.router.createUrlTree([], { queryParams: { room: this.userService.user.roomUid } });
      const tree= {} as any

        this.clipboard.copy(`http://localhost:4200${this.serializer.serialize(tree)}`);
        this.snackBarService.openSnackBar("Send this link to your friend");
        
  }
}

