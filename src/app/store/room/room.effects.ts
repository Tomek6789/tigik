import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Action, State, Store } from "@ngrx/store";
import { AppState } from "app/app.module";
import { LotteryService } from "app/services/lottery.service";
import { RoomsService } from "app/services/rooms.service";
import { UserService } from "app/services/users.service";
import { tap, switchMap, map, mergeMap, filter } from "rxjs/operators";
import { from, of } from "rxjs";
import { createRoom, finishGame, getRoom, getRoomSuccess, playerLeaveRoom, selectedElement, startGame, startGameSuccess } from "./room.actions";
import { bestScoreSelector, isUserLoginSelector, roomUidSelector, scoreSelector, userRoleSelector, userUidSelector } from "../user/user.selectors";
import { waitForActions, waitForProp } from "app/wait-for-actions";
import { signInAsAnonymous, startGameForAnonymous, userStateChangedSuccess } from "../user/user.actions";
import { guestUidSelector, searchingElementSelector } from "./room.selectors";

@Injectable({ providedIn: 'root'})
export class RoomEffects {

    getRoom$ = createEffect(() => this.actions$.pipe(
        ofType(getRoom),
        waitForProp('roomUid', this.store),
        concatLatestFrom(() => [
            this.store.select(roomUidSelector),
        ]),
        switchMap(([action,  roomUid ]) => {
            return this.roomService.onMyRoomStateChanged(roomUid)
        }),
        map((room) => {
            return getRoomSuccess({ room })
        })
    ))

    startGame$ = createEffect(() => this.actions$.pipe(
        ofType(startGame),
        concatLatestFrom(() => [
            this.store.select(roomUidSelector),
            this.store.select(scoreSelector),
            this.store.select(isUserLoginSelector),
        ]),
        switchMap(([action, roomUid, score, isLogin ]) => {
            if(isLogin) {   
                return from(this.roomService.startGame(roomUid, true, this.randomElement(score))).pipe(map(() => startGameSuccess()))
            } else {
                return of(signInAsAnonymous())
            }
        })
    ))

    startGameForAnonymous$ = createEffect(() => this.actions$.pipe(
        ofType(startGameForAnonymous),
        waitForActions([getRoomSuccess(null)], this.actions$),
        concatLatestFrom(() => [
            this.store.select(roomUidSelector),
            this.store.select(scoreSelector),
        ]),
        switchMap(([action, roomUid, score]) => {
            return from(this.roomService.startGame(roomUid, true, this.randomElement(score))).pipe(map(() => startGameSuccess()))
        })
    ))

    selectedElement$ = createEffect(() => this.actions$.pipe(
        ofType(selectedElement),
        concatLatestFrom(() => [
            this.store.select(userUidSelector),
            this.store.select(roomUidSelector),
            this.store.select(scoreSelector),
            this.store.select(searchingElementSelector),
        ]),
        tap(([action, userUid, roomUid , score, searchingElement ]) => {
            if(searchingElement === action.selectedElement) {
                this.roomService.searchingElement(roomUid, this.randomElement(score))
                this.userService.updateScore(userUid, score + 10 )
            }
        })
    ), { dispatch: false })

        finishGame$ = createEffect(() => this.actions$.pipe(
            ofType(finishGame),
            concatLatestFrom(() => [
                this.store.select(userUidSelector),
                this.store.select(roomUidSelector),
                this.store.select(scoreSelector),
                this.store.select(bestScoreSelector)
            ]),
            tap(([action, userUid, roomUid, score, bestScore]) => {
                if(score > bestScore) {
                    this.userService.updateBestScore(userUid, score)
                }
                this.roomService.startGame(roomUid, false, null);
                this.userService.updateScore(userUid, 0);
                
            })
        ), { dispatch: false })


    playerLeaveRoom$ = createEffect(() => this.actions$.pipe(
        ofType(playerLeaveRoom),
        concatLatestFrom(() => [
            this.store.select(userUidSelector),
            this.store.select(userRoleSelector),
            this.store.select(roomUidSelector),
        ]),
        tap(([action, userUid, userRole, roomUid ]) => {
            const role = userRole === 'host' ? 'hostUid' : 'guestUid';
            this.roomService.removeUserFromRoom(roomUid, role)
            this.userService.updateRoom(userUid, null);
            this.userService.updateRole(userUid, null);
            this.userService.updateIsLogin(userUid, false);
        })
    ), { dispatch: false })

    createRoom$ = createEffect(() => this.actions$.pipe(
        ofType(createRoom),
        waitForActions([userStateChangedSuccess(null)], this.actions$),
        concatLatestFrom(() => [
            this.store.select(userUidSelector),
        ]),
        switchMap(([action, userUid]) => {
            let roomUid: string;
            return from(
                this.roomService.createRoom(userUid)
                    .then((room) => {
                        roomUid = room.key
                        this.userService.updateRole(userUid, 'host');
                        return this.userService.updateRoom(userUid, roomUid)
                    })
            ).pipe(map(() => ({userUid, roomUid})))
        }),
        map(() => getRoom())
    ))

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private userService: UserService,
        private roomService: RoomsService,
        private lotteryService: LotteryService
      ) {}


    private randomElement(score: number): string {
        return this.lotteryService.drawElement(score)
      }
}