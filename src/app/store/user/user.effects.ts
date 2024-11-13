import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "app/auth/auth.service";
import {
  getLoginUser,
  userIsLogIn,
  getUser,
  userStateChangedSuccess,
  signInUser,
  userIsLogOut,
  signOutUser,
  getOpponent,
  opponentStateChangedSuccess,
  signInAsAnonymous,
  updateRoomUid,
  removeRoomUid,
  updateIsLogin,
} from "./user.actions";
import { map, mergeMap, switchMap, tap } from "rxjs/operators";
import { from, pipe } from "rxjs";
import { Injectable } from "@angular/core";
import { UserService } from "app/services/users.service";
import { UserCredential } from "@firebase/auth";
import { createRoom, joinRoom, playerLeaveRoom } from "../room/room.actions";
import { Action, Store } from "@ngrx/store";
import { userUidSelector } from "./user.selectors";
import { waitForOpponent } from "app/wait-for-actions";
import { AppState } from "app/app.module";

@Injectable({ providedIn: "root" })
export class UserEffects {
  getLoginUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getLoginUser),
      switchMap(({ roomUid }) => {
        return this.auth.authStateChanged$.pipe(
          map((userUid) => ({ userUid, roomUid }))
        );
      }),
      mergeMap(({ userUid, roomUid }) => {
        const actions: Action[] = [];
        if (userUid) {
          // host user
          actions.push(
            userIsLogIn({ userUid }),
            getOpponent(),
            getUser({ userUid })
          );
        }

        if (roomUid && userUid != null) {
          // for opponent when join via link
          // first getRoom and then join
          actions.push(joinRoom({ roomUid, userUid }));
        }

        if (userUid && roomUid == null) {
          // for host always create room
          actions.push(createRoom({ userUid }));
        }

        if (userUid == null) {
          if (this.auth.userCreated) {
            actions.push(userIsLogOut());
          } else {
            actions.push(signInAsAnonymous());
          }
        }

        return actions;
      })
    );
  });

  signIn$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(signInUser),
        switchMap(() => {
          return from(this.auth.googleSignIn());
        }),
        this.createUser()
      );
    },
    { dispatch: false }
  );

  signInAsAnonymous$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(signInAsAnonymous),
        switchMap(() => {
          return from(this.auth.anonymous());
        }),
        this.createUser()
      );
    },
    { dispatch: false }
  );

  signOut$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(signOutUser),
        tap(() => {
          this.auth.signOut();
        })
      );
    },
    { dispatch: false }
  );

  logIn$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(userIsLogIn),
        tap(({ userUid }) => {
          this.userService.updateIsLogin(userUid, true);
        })
      );
    },
    { dispatch: false }
  );

  logOut$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(userIsLogOut),
      concatLatestFrom(() => [this.store.select(userUidSelector)]),
      tap(([action, userUid]) => {
        this.userService.updateIsLogin(userUid, false);
      }),
      map(() => {
        return playerLeaveRoom();
      })
    );
  });

  // above are auth effects

  getUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getUser),
      switchMap(({ userUid }) => {
        return this.userService.onUserStateChanged(userUid);
      }),
      map((user) => {
        return userStateChangedSuccess({ user });
      })
    );
  });

  getOpponent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getOpponent),
      waitForOpponent(this.store),
      switchMap((opponentUid) => {
        return this.userService.onUserStateChanged(opponentUid);
      }),
      map((opponent) => {
        return opponentStateChangedSuccess({ opponent });
      })
    );
  });

  updateRoomUid$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(updateRoomUid),
        tap(({ roomUid, userUid }) => {
          this.userService.updateRoomUid(userUid, roomUid);
        })
      );
    },
    { dispatch: false }
  );

  removeRoomUid$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(removeRoomUid),
        tap(({ userUid }) => {
          this.userService.updateRoomUid(userUid, "");
        })
      );
    },
    { dispatch: false }
  );

  updateIsLogin$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(updateIsLogin),
        tap(({ isLogin, userUid }) =>
          this.userService.updateIsLogin(userUid, isLogin)
        )
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private auth: AuthService,
    private userService: UserService
  ) {}

  private createUser() {
    return pipe(
      // filter((user: UserCredential) => {
      //     return user.user.metadata.creationTime === user.user.metadata.lastSignInTime
      // }),
      switchMap(
        ({
          user: { displayName, photoURL, uid, isAnonymous },
        }: UserCredential) => {
          return from(
            //createUser in my user database,
            this.userService.createUser({
              isAnonymous,
              isLogin: true,
              displayName,
              photoURL,
              userUid: uid,
              score: 0,
            })
          ).pipe(map(() => uid));
        }
      )
    );
  }
}
