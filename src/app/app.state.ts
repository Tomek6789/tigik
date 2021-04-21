import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, forkJoin, from, merge, Observable, of } from "rxjs";
import { distinctUntilChanged, filter, map, mergeMap, pluck, scan, shareReplay, switchMap, toArray } from "rxjs/operators";
import { Role, User } from "./auth/user.model";
import { Element } from "./models/element";
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
    level$ = new BehaviorSubject("One");

    rooms$ = this.roomsService.rooms$;

    //user
    isLogin$ = this.userService.authUserUid$.pipe(map(Boolean))
    user$ = this.userService.user$
    hasRoom$ = this.user$.pipe(pluck('roomUid'), map(Boolean), distinctUntilChanged())
    userRoomUid$ = this.user$.pipe(pluck('roomUid'), filter<string>(Boolean), distinctUntilChanged())
    userUid$ = this.user$.pipe(pluck('uid'), filter<string>(Boolean), distinctUntilChanged())
    role$ = this.user$.pipe(pluck('role'), filter<Role>(Boolean), distinctUntilChanged())
    score$ = this.user$.pipe(pluck('score'), filter<number>(Boolean), distinctUntilChanged())
    bestScore$ = this.user$.pipe(pluck('bestScore'), filter<number>(Boolean), distinctUntilChanged())
    isBestScore$ = combineLatest([this.score$, this.bestScore$]).pipe(
        filter(([score, bestScore]) => score >= bestScore),
        map(([score]) => score)
    );


    //room
    userRoom$ = this.user$.pipe(
        filter((user) => Boolean(user.roomUid)),
        switchMap(user => this.roomsService.onMyRoomStateChanged(user.roomUid)),
        filter((room) => Boolean(room)),
        shareReplay(1),
    )

    startGame$ = this.userRoom$.pipe(
        pluck("startGame")
    )
    periodicTableRoom$ = this.userRoom$.pipe(
        map(({ startGame, searchingElement }) => ({ startGame, searchingElement })),
    );
    searchingElementChanged$ = this.userRoom$.pipe(pluck('searchingElement'))

    private roomPlayers$ = this.rooms$.pipe(
        switchMap(rooms => from(rooms).pipe(
            mergeMap(({ guestUid, hostUid, key }) => {
                return forkJoin({
                    roomUid: of(key),
                    guest: guestUid ? this.userService.getUser(guestUid) : of(null),
                    host: hostUid ? this.userService.getUser(hostUid) : of(null)
                }).pipe(toArray())
            }),
            // map(a => [a]),
            scan((acc, curr) => [...acc, ...curr], [] as RoomsPlayers[])
        )),
    )
    private emptyRooms$ = this.rooms$.pipe(filter(a => !a.length))

    playersInRooms$ = merge(this.roomPlayers$, this.emptyRooms$)

    hostPlayer$ = this.userRoom$.pipe(
        switchMap((myRoom) => this.userService.onUserStateChanged(myRoom.hostUid))
    );

    guestPlayer$ = this.userRoom$.pipe(
        filter((room) => Boolean(room.guestUid)),
        switchMap(({ guestUid }) => this.userService.onUserStateChanged(guestUid))
    );


    constructor(private userService: UserService, private roomsService: RoomsService, private periodicTableService: PeriodicTableService) { }

}