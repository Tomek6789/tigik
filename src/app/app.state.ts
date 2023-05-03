import { Injectable } from "@angular/core";
import { combineLatest, forkJoin, from, merge, Observable, of } from "rxjs";
import { concatMap, distinctUntilChanged, filter, map, pluck, shareReplay, switchMap, toArray, startWith, tap, withLatestFrom, take } from "rxjs/operators";
import { Role, User } from "./auth/user.model";
import { Element } from "./models/element";
import { LotteryService } from "./services/lottery.service";
import { PeriodicTableService } from "./services/periodic-table.service";
import { RoomsService } from "./services/rooms.service";
import { UserService } from "./services/users.service";

export interface RoomsPlayers {
    roomUid: string,
    host: User,
    guest: User
}

@Injectable({
    providedIn: 'root'
})
export class AppState {
    table$: Observable<Element[]> = this.periodicTableService.getPeriodicTable();


    //user

    user$ = this.userService.user$
    hasRoom$ = this.user$.pipe(pluck('roomUid'), map(Boolean), distinctUntilChanged())
    userRoomUid$ = this.user$.pipe(pluck('roomUid'), filter<string>(Boolean), distinctUntilChanged())
    userUid$ = this.user$.pipe(pluck('uid'), filter<string>(Boolean), distinctUntilChanged())
    role$ = this.user$.pipe(pluck('role'), filter<Role>(Boolean), distinctUntilChanged())
    score$ = this.user$.pipe(pluck('score'), distinctUntilChanged())
    bestScore$ = this.user$.pipe(pluck('bestScore'), distinctUntilChanged())
    isBestScore$ = combineLatest([this.score$, this.bestScore$]).pipe(
        filter(([score, bestScore]) => score >= bestScore || bestScore == null),
        map(([score]) => score)
    );


    userRoom$ = this.userRoomUid$.pipe(
        switchMap(roomUid => this.roomsService.onMyRoomStateChanged(roomUid)),
        filter((room) => Boolean(room)),
        shareReplay(1),
    )
    

    startGame$ = this.userRoom$.pipe(
        pluck("startGame")
    )
    periodicTableRoom$ = this.userRoom$.pipe(
        map(({ startGame, searchingElement }) => ({ startGame, searchingElement })),
    );
    searchingElementChanged$ = this.userRoom$.pipe(pluck('searchingElement'));


    opponentPlayer$ = combineLatest([this.role$, this.userRoom$]).pipe(
        map(([logginUserRole, room]) => {
            const key = logginUserRole === "host" ? "guestUid" : "hostUid";
            console.log('Oponent:',key)
            return room[key]
        }),
        filter<string>(Boolean), //when guest is not in room
        switchMap((playerUid) => this.userService.onUserStateChanged(playerUid)),
    ) 
    

    constructor(
        private userService: UserService, 
        private roomsService: RoomsService, 
        private periodicTableService: PeriodicTableService,     
        private lotteryService: LotteryService,
        ) { 
    }


    createRoomUpdateUserRoomAndRole( ) {
        this.user$.pipe(
            take(1),
            tap((user) => {
            const room = this.roomsService.createRoom(user.uid)
            const roomUid = room.key
            this.userService.updateRoomAndRole(roomUid, 'host')
            })
        ).subscribe()
    }

    createRoomUpdateUserRoomAndRoleAndStartGame( ) {
        const room = this.roomsService.createRoom(this.userService.user.uid)
        this.userService.updateRoomAndRole(room.key, 'host')
        this.startGame()
    }

    startGame() {
        this.roomsService.startGame(this.userService.user.roomUid, true, this.randomElement(0));

    }

    game(score: number) {
        this.roomsService.searchingElement(this.userService.user.roomUid, this.randomElement(score));
        this.userService.updateScore(score += 10);

    }

    private randomElement(score: number): string {
        return this.lotteryService.drawElement(score)
      }
}