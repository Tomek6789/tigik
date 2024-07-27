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
  getRoomSuccess,
  joinRoom,
  joinRooomSuccess,
  playerLeaveRoom,
  selectedElement,
  startGame,
  startGameSuccess,
} from "./room.actions";
import {
  bestScoreSelector,
  isUserLoginSelector,
  roomUidSelector,
  scoreSelector,
  userUidSelector,
} from "../user/user.selectors";
import { waitForActions, waitForProp } from "app/wait-for-actions";
import {
  signInAsAnonymous,
  startGameForAnonymous,
  userStateChangedSuccess,
} from "../user/user.actions";
import {
  roomPlayersSelector,
  searchingElementSelector,
} from "./room.selectors";
import { Test } from "app/services/callable-functions";
import { SnackBarService } from "app/services/snackbar.service";

@Injectable({ providedIn: "root" })
export class RoomEffects {
  getRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRoom),
      switchMap(({ roomUid }) => {
        return this.callableFunctions
          .checkRoomExists()({ roomUid })
          .pipe(
            switchMap(() => {
              return this.roomService.onMyRoomStateChanged(roomUid);
            }),
            map((room) => {
              return getRoomSuccess({ room });
            }),
            catchError(() => {
              this.snackBarService.openSnackBar(
                "Room not exists, please get new invitation"
              );
              return of(getRoomFailure());
            })
          );
      })
    )
  );

  startGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startGame),
      concatLatestFrom(() => [
        this.store.select(roomUidSelector),
        this.store.select(scoreSelector),
        this.store.select(isUserLoginSelector),
      ]),
      switchMap(([action, roomUid, score, isLogin]) => {
        if (isLogin) {
          return from(
            this.roomService.startGame(roomUid, true, this.randomElement(score))
          ).pipe(map(() => startGameSuccess()));
        } else {
          return of(signInAsAnonymous());
        }
      })
    )
  );

  startGameForAnonymous$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startGameForAnonymous),
      waitForActions([getRoomSuccess(null)], this.actions$),
      concatLatestFrom(() => [
        this.store.select(roomUidSelector),
        this.store.select(scoreSelector),
      ]),
      switchMap(([action, roomUid, score]) => {
        return from(
          this.roomService.startGame(roomUid, true, this.randomElement(score))
        ).pipe(map(() => startGameSuccess()));
      })
    )
  );

  selectedElement$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(selectedElement),
        concatLatestFrom(() => [
          this.store.select(userUidSelector),
          this.store.select(roomUidSelector),
          this.store.select(scoreSelector),
        ]),
        tap(([action, userUid, roomUid, score]) => {
          console.log(userUid);
          this.roomService.animate(roomUid, action.selectedElement, userUid);

          setTimeout(() => {
            console.log("newEleletToSeearch");
            this.roomService.searchingElement(
              roomUid,
              this.randomElement(score)
            );
          }, 800);

          this.userService.updateScore(userUid, score + 10);
          return startGameSuccess();
        })
      ),
    { dispatch: false }
  );

  finishGame$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(finishGame),
        concatLatestFrom(() => [
          this.store.select(userUidSelector),
          this.store.select(roomUidSelector),
          this.store.select(scoreSelector),
          this.store.select(bestScoreSelector),
        ]),
        tap(([action, userUid, roomUid, score, bestScore]) => {
          if (score > bestScore) {
            this.userService.updateBestScore(userUid, score);
          }
          this.roomService.startGame(roomUid, false, null);
          this.roomService.clearAnimate(roomUid);
          this.userService.updateScore(userUid, 0);
        })
      ),
    { dispatch: false }
  );

  playerLeaveRoom$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(playerLeaveRoom),
        concatLatestFrom(() => [
          this.store.select(userUidSelector),
          this.store.select(roomUidSelector),
          this.store
            .select(roomPlayersSelector)
            .pipe(filter<string[]>(Boolean)),
        ]),
        tap(([action, userUid, roomUid, players]) => {
          const all = players.filter((uid) => uid !== userUid);
          if (all.length === 1) {
            this.roomService.removeUserFromRoomPlayers(roomUid, all);
          }

          if (all.length === 0) {
            this.roomService.removeRoom(roomUid);
          }
          this.userService.updateRoom(userUid, null);
          this.userService.updateIsLogin(userUid, false);
        })
      ),
    { dispatch: false }
  );

  createRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createRoom),
      waitForActions([userStateChangedSuccess(null)], this.actions$),
      concatLatestFrom(() => [this.store.select(userUidSelector)]),
      switchMap(([action, userUid]) => {
        let roomUid: string;
        return from(
          this.roomService.createRoom(userUid).then((room) => {
            roomUid = room.key;
            return this.userService.updateRoom(userUid, roomUid);
          })
        ).pipe(map(() => ({ roomUid })));
      }),
      map(({ roomUid }) => getRoom({ roomUid }))
    )
  );

  joinRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(joinRoom),
      waitForActions([getRoomSuccess(null)], this.actions$),
      concatLatestFrom(() => [this.store.select(roomPlayersSelector)]),
      tap(async ([{ roomUid, userUid }, players]) => {
        console.log("join befero wait", { userUid, roomUid });
        await this.userService.updateRoom(userUid, roomUid);

        const all = [...players, userUid];
        console.log("join", all, "ooom", roomUid);
        await this.roomService.joinRoom(roomUid, all);
      }),
      map(() => {
        console.log("join succeess");
        return joinRooomSuccess();
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private userService: UserService,
    private roomService: RoomsService,
    private lotteryService: LotteryService,
    private callableFunctions: Test,
    private snackBarService: SnackBarService
  ) {}

  private randomElement(score: number): string {
    return this.lotteryService.drawElement(score);
  }
}
