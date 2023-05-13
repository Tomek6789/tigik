import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { State, Store } from "@ngrx/store";
import { AppState } from "app/app.module";
import { LotteryService } from "app/services/lottery.service";
import { RoomsService } from "app/services/rooms.service";
import { UserService } from "app/services/users.service";
import { tap } from "rxjs/operators";
import { roomUidSelector, userUidSelector } from "../user/user.selectors";
import { selectedElement, startGame } from "./room.actions";

@Injectable({ providedIn: 'root'})
export class RoomEffects {

    startGame$ = createEffect(() => this.actions$.pipe(
        ofType(startGame),
        concatLatestFrom(() => [
            this.store.select(roomUidSelector),
            this.userService.user$
        ]),
        tap(([action, roomUid, user]) => {
            console.log('STAR GAMEEEE',user)
            const a = this.roomService.startGame(roomUid, true, this.randomElement(user.score))
        })
    ), { dispatch: false })

    selectedElement$ = createEffect(() => this.actions$.pipe(
        ofType(selectedElement),
        concatLatestFrom(() => [
            this.store.select(roomUidSelector),
            this.userService.user$
        ]),
        tap(([action, roomUid, { score, uid: userUid }]) => {
            this.roomService.searchingElement(roomUid, this.randomElement(score))
            this.userService.updateScore(userUid, score + 10 )
        })
    ), { dispatch: false })

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