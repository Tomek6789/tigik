import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Action, State, Store } from "@ngrx/store";
import { AppState } from "app/app.module";
import { LotteryService } from "app/services/lottery.service";
import { RoomsService } from "app/services/rooms.service";
import { UserService } from "app/services/users.service";
import {
  tap,
  switchMap,
  map,
  mergeMap,
  filter,
  catchError,
} from "rxjs/operators";
import { from, of } from "rxjs";
import {
  createRoom,
  finishGame,
  getRoom,
  getRoomFailure,
  roomStateChangedSuccess,
  joinRoom,
  playerLeaveRoom,
  selectedElement,
  startGame,
  startGameSuccess,
  createRoomSuccess,
  listenRoomRemoved,
} from "./room.actions";
import {
  bestScoreSelector,
  isUserLoginSelector,
  roomUidSelector,
  scoreSelector,
  userUidSelector,
} from "../user/user.selectors";
import { signInAsAnonymous, updateRoomUid } from "../user/user.actions";
import { FirebaseFunctions } from "app/services/callable-functions";
import { SnackBarService } from "app/services/snackbar.service";
import { Router } from "@angular/router";
import {
  attemptSelector,
  isSinglePlayerModeSelector,
  roomPlayersSelector,
  searchingElementSelector,
} from "./room.selectors";

@Injectable({ providedIn: "root" })
export class RoomEffects {
  getRoom$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getRoom),
      switchMap(({ roomUid }) => {
        return this.roomService.onMyRoomStateChanged(roomUid);
      }),
      map((room) => {
        return roomStateChangedSuccess({ room });
      }),
      catchError(() => {
        this.snackBarService.openSnackBar(
          "Room not exists, please get new invitation"
        );
        return of(getRoomFailure());
      })
    );
  });

  createRoom$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createRoom),
      switchMap(({ userUid }) => {
        let roomUid: string;
        return from(
          this.roomService.createRoom(userUid).then((room) => {
            roomUid = room.key;
          })
        ).pipe(map(() => ({ roomUid, userUid })));
      }),
      mergeMap(({ userUid, roomUid }) => [
        getRoom({ roomUid }),
        updateRoomUid({ userUid, roomUid }),
        createRoomSuccess(),
      ])
    );
  });

  joinRoom$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(joinRoom),
      switchMap(({ roomUid, userUid }) => {
        return this.callableFunctions
          .checkRoomExists()({ roomUid })
          .pipe(
            tap(() => {
              this.roomService.joinRoom(roomUid, userUid);
            }),
            mergeMap(() => {
              return [
                getRoom({ roomUid }),
                updateRoomUid({ userUid, roomUid }),
              ];
            }),
            catchError(() => {
              this.snackBarService.openSnackBar(
                "Room not exists, Room created, Invite opponent"
              );
              this.router.navigate(["/"]);

              return of(getRoomFailure(), createRoom({ userUid }));
            })
          );
      })
    );
  });

  startGame$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(startGame),
      concatLatestFrom(() => [
        this.store.select(roomUidSelector),
        this.store.select(scoreSelector),
        this.store.select(isUserLoginSelector),
      ]),
      switchMap(([action, roomUid, score, isLogin]) => {
        if (isLogin) {
          return of("start game").pipe(
            tap(() => {
              this.roomService.startGame(roomUid, true);
              this.roomService.winnerUid(roomUid, null);
              this.roomService.searchingElement(
                roomUid,
                this.randomElement(score)
              );
            }),
            map(() => startGameSuccess())
          );
        } else {
          return of(signInAsAnonymous());
        }
      })
    );
  });

  selectedElement$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(selectedElement),
        concatLatestFrom(() => [
          this.store.select(userUidSelector),
          this.store.select(roomUidSelector),
          this.store.select(scoreSelector),
          this.store.select(isSinglePlayerModeSelector),
        ]),
        tap(([action, userUid, roomUid, score, isSinglePlayerMode]) => {
          let test;
          this.roomService.animate(roomUid, action.selectedElement);

          test = setTimeout(() => {
            this.roomService.searchingElement(
              roomUid,
              this.randomElement(score)
            );
          }, 800);

          this.userService.updateScore(userUid, score + 10);

          if (!isSinglePlayerMode && score === 70) {
            clearTimeout(test);
            this.roomService.winnerUid(roomUid, userUid);
            this.roomService.startGame(roomUid, false);
            this.roomService.clearAnimate(roomUid);
            this.userService.updateScore(userUid, 0);
          }
        })
      );
    },
    { dispatch: false }
  );

  finishGame$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(finishGame),
        concatLatestFrom(() => [
          this.store.select(userUidSelector),
          this.store.select(roomUidSelector),
          this.store.select(scoreSelector),
          this.store.select(bestScoreSelector),
          this.store.select(searchingElementSelector),
          this.store.select(isSinglePlayerModeSelector),
          this.store.select(attemptSelector),
        ]),
        tap(
          ([
            action,
            userUid,
            roomUid,
            score,
            bestScore,
            selectedElement,
            isSinglePlayerMode,
            attempt,
          ]) => {
            if (score > bestScore) {
              this.userService.updateBestScore(userUid, score);
            }
            if (!isSinglePlayerMode && attempt < 1) {
              this.roomService.animate(roomUid, selectedElement);
              this.roomService.setAttempt(roomUid, attempt);

              setTimeout(() => {
                this.roomService.searchingElement(
                  roomUid,
                  this.randomElement(score)
                );
              }, 800);
            } else {
              this.roomService.startGame(roomUid, false);
              this.roomService.setAttempt(roomUid, 0);
              this.userService.updateScore(userUid, 0);
              this.roomService.animate(roomUid, selectedElement);
              setTimeout(() => {
                this.roomService.clearAnimate(roomUid);
              }, 800);
            }
          }
        )
      );
    },
    { dispatch: false }
  );

  playerLeaveRoom$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(playerLeaveRoom),
        concatLatestFrom(() => [
          this.store.select(userUidSelector),
          this.store.select(roomUidSelector),
          this.store.select(roomPlayersSelector),
        ]),
        tap(([action, userUid, roomUid, players]) => {
          if (players.hostUid === userUid) {
            this.roomService.removeRoom(roomUid);
          } else {
            this.roomService.removeOpponentFromRoom(roomUid, {
              hostUid: players.hostUid,
              opponentUid: null,
            });
          }
        })
      );
    },
    { dispatch: false }
  );

  // when host leave room
  removedRoom$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(listenRoomRemoved),
      switchMap(() => {
        return this.roomService.roomRemoved$;
      }),
      concatLatestFrom(() => [
        this.store.select(userUidSelector),
        this.store.select(isUserLoginSelector),
      ]),
      filter(([, , isLogin]) => isLogin),
      tap(() => {
        this.snackBarService.openSnackBar(
          "Your opponent left the room, we created room for you, please invite someone or play individually"
        );
        this.router.navigate(["/"]);
      }),
      mergeMap(([, userUid]) => {
        return [createRoom({ userUid })];
      })
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private userService: UserService,
    private roomService: RoomsService,
    private lotteryService: LotteryService,
    private callableFunctions: FirebaseFunctions,
    private snackBarService: SnackBarService
  ) {}

  private randomElement(score: number): string {
    return this.lotteryService.drawElement(score);
  }
}
