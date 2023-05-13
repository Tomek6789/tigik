import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "app/auth/auth.service";
import { getLoginUser, isUserLogIn, setUser, setUserSuccess, signInUser, signInUserSuccess } from './user.actions'
import { filter, map, mergeMap, switchMap , tap, withLatestFrom} from 'rxjs/operators'
import { from } from "rxjs";
import { Injectable } from "@angular/core";
import { UserService } from "app/services/users.service";
import { UserCredential} from '@firebase/auth'
import { RoomsService } from "app/services/rooms.service";
import { User } from '../../auth/user.model'
import { user } from "@angular/fire/auth";

@Injectable({ providedIn: 'root'})
export class UserEffects {

    // loginUser with signinWithPopup
    // createUser in my user database,
    // createRoom in my user database 
    signin$ = createEffect(() => this.actions$.pipe(
        ofType(signInUser), 
        switchMap(() => {
            return from(this.auth.googleSignin())

        }),
        switchMap(({ user: { displayName, photoURL , uid }}: UserCredential) => {
            return from(
                this.userService.createUser({ 
                    uid,
                    displayName,
                    photoURL,
                    score: 0
                })
            ).pipe(
                map(() => uid)
            )
        }),
        switchMap((userUid: string) => {
            let roomUid: string;
            return from(
                this.roomService.createRoom(userUid)
                    .then((room) => {
                        roomUid = room.key
                        this.userService.updateRoomAndRole(userUid, roomUid , 'host')
                    })
            ).pipe(map(() => ({userUid, roomUid})))
        }),
        tap(({userUid}) => {
            this.userService.userUid.next(userUid)
        }),
        map(({userUid, roomUid}) => {            
            return signInUserSuccess({ userUid, roomUid })
        })
    ))

    getLoginUserOnInit$ = createEffect(() => this.actions$.pipe(
        ofType(getLoginUser), 
        switchMap(() => {
            return  this.auth.aauthStateChanged$
        }),
        tap((user) => {
            if(user) {
                console.log('next user')
                this.userService.userUid.next(user.uid)
            }
        }),
        mergeMap((user) => {
            console.log( user)
            return [isUserLogIn({ isLogin: Boolean(user)}), setUser()]
        })
    ))

    setUser$ = createEffect(() => this.actions$.pipe(
        ofType(setUser), 
        switchMap(() => this.userService.user$),
        tap((x) => console.log('KURQWAAA', x)),
        map((user) => setUserSuccess({ roomUid: user.roomUid, userUid: user.uid}))
    ))

    constructor(
        private actions$: Actions,
        private auth: AuthService,
        private userService: UserService,
        private roomService: RoomsService
      ) {}
}