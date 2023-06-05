import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "app/auth/auth.service";
import { getLoginUser, userIsLogIn, getUser, userStateChangedSuccess, signInUser, userIsLogOut, signOutUser, getOpponent, opponentStateChangedSuccess, inviteOpponent, signInAsAnonymous, startGameForAnonymous, signForGuest, changeUserRole } from './user.actions'
import { filter, map, mergeMap, switchMap ,  tap } from 'rxjs/operators'
import { from, pipe } from "rxjs";
import { Injectable } from "@angular/core";
import { UserService } from "app/services/users.service";
import { UserCredential} from '@firebase/auth'
import { RoomsService } from "app/services/rooms.service";
import { createRoom, getRoom, getRoomSuccess, removeRoom } from "../room/room.actions";
import { Action, Store } from "@ngrx/store";
import { roomUidSelector, userUidSelector } from "./user.selectors";
import { waitForActions, waitForProp2 } from "app/wait-for-actions";
import { opponentUidSelector } from "app/app.selectors";
import { AppState } from "app/app.module";
import { Role } from "app/auth/user.model";


@Injectable({ providedIn: 'root'})
export class UserEffects {

    getLoginUserOnInit$ = createEffect(() => this.actions$.pipe(
        ofType(getLoginUser), 
        switchMap(({ roomUid }) => {
            return  this.auth.authStateChanged$.pipe(map((userUid) => ({ roomUid, userUid })))
        }),
        mergeMap(({userUid, roomUid}) => {
            console.log(userUid, roomUid )
            const actions: Action[] = []
            if(userUid) {
                //login user
                actions.push(userIsLogIn({userUid}), getOpponent(), getUser({ userUid }))
            } else {
                //logout user or no user(first time in app)
                actions.push(userIsLogOut())
            }

            //guest user
            if(roomUid) {
                actions.push(getRoom(), changeUserRole())
            } 

            //guest user - create user
            if(userUid === null) {
                actions.push(signForGuest({ roomUid }))
            }

            //host user
            if(userUid && roomUid === undefined) {
                actions.push(createRoom())
            }


            return actions;
        })
    ))

    getUser$ = createEffect(() => this.actions$.pipe(
        ofType(getUser),
        switchMap(({ userUid }) => {
            return this.userService.onUserStateChanged(userUid)
        }),
        map((user) => {
           return userStateChangedSuccess({ user })
        })
    ))

    getOpponent$ = createEffect(() => this.actions$.pipe(
        ofType(getOpponent),
        waitForActions([ getRoomSuccess(null)], this.actions$),
        waitForProp2('asd', this.store),
        concatLatestFrom(() => [
            this.store.select(opponentUidSelector)
        ]),
        filter(([action, opponentUid]) => Boolean(opponentUid)),
        switchMap(([action, opponentUid] ) => {
            return this.userService.onUserStateChanged(opponentUid)
        }),
        map((opponent) => {
           return opponentStateChangedSuccess({ opponent })
        })
    ))

    signIn$ = createEffect(() => this.actions$.pipe(
        ofType(signInUser), 
        switchMap(() => {
            //loginUser with signInWithPopup
            //cause onAuthStateChanged trigged
            return from(this.auth.googleSignIn())
        }),
        this.createUser()
    ), { dispatch: false })

    signInAsAnonymous$ = createEffect(() => this.actions$.pipe(
        ofType(signInAsAnonymous),
        switchMap(() => {
            return from(this.auth.anonymous())
        }),
        this.createUser(),
        map(() => {
            return startGameForAnonymous()
        })
    ))

    signInForGuest$ = createEffect(() => this.actions$.pipe(
        ofType(signForGuest),
        switchMap(({ roomUid }) => {
            return from(this.auth.anonymous()).pipe(map((user) => ({ ...user, roomUid })))
        }),
        this.createUser('guest'),
        map(() => {
            return startGameForAnonymous()
        })
    ))

    signOut$ = createEffect(() => 
        this.actions$.pipe(
            ofType(signOutUser),
            concatLatestFrom(() => [
                this.store.select(userUidSelector),
                this.store.select(roomUidSelector)
            ]),
            tap(([action, userUid, roomUid]) => {
                this.auth.signOut()
            })
        ), { dispatch: false })

    logIn$ = createEffect(() => this.actions$.pipe(
        ofType(userIsLogIn),
        tap(({ userUid }) => {
            console.log('login: isLogin', true, userUid)
            this.userService.updateIsLogin(userUid, true)
        })
    ), { dispatch: false })

    logOut$ = createEffect(() => this.actions$.pipe(
        ofType(userIsLogOut),
        concatLatestFrom(() => [
            this.store.select(userUidSelector),
        ]),
        filter<[any, string]>(([action, userUid]) => Boolean(userUid)), // first time visit page - no user
        tap(([action, userUid]) => {
            console.log('logout: isLogin', false, userUid)
            this.userService.updateIsLogin(userUid, false)
        })
    ), { dispatch: false })


    changeUserRole = createEffect(() => this.actions$.pipe(
        ofType(changeUserRole),
        concatLatestFrom(() => [
            this.store.select(userUidSelector)
        ]),
        tap(([action, userUid]) => {
            this.userService.updateRole(userUid, 'guest')
        })
    ), { dispatch: false })

    // inviteOpponent$ = createEffect(() => this.actions$.pipe(
    //     ofType(inviteOpponent),
    //     // waitForActions([])
    //     switchMap(({ roomUid }) => {
    //         //login guest as anonymous
    //         //cause onAuthStateChanged trigged
    //         return from(this.auth.anonymous()).pipe(map((user) => ({  roomUid, displayName: user.user.displayName, guestUid: user.user.uid, isAnonymous: user.user.isAnonymous })))
    //     }),
    //     switchMap(({ roomUid,  displayName,  guestUid, isAnonymous }) => {
    //         return from(
    //             //createUser in my user database,
    //             this.userService.createUser({
    //                 isAnonymous,
    //                 isLogin: true,
    //                 displayName,
    //                 userUid: guestUid,
    //                 score: 0,
    //                 role: 'guest',
    //                 roomUid,
    //             })
    //         ).pipe(
    //             map(() => ({guestUid, roomUid}))
    //         )
    //     }),
    //     tap(({roomUid, guestUid}) => {
    //         this.roomService.joinRoom(roomUid, guestUid)
    //     }),
    // ), { dispatch: false })


    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private auth: AuthService,
        private userService: UserService,
        private roomService: RoomsService
      ) {}

    private createUser(roomUid: string = '', role: Role = 'host') {
        return pipe(
            // filter((user: UserCredential) => {
            //     return user.user.metadata.creationTime === user.user.metadata.lastSignInTime 
            // }),
            switchMap(({ roomUid, user: { displayName, photoURL , uid, isAnonymous }}: UserCredential & { roomUid: string }) => {
                console.log(isAnonymous)
                return from(
                    //createUser in my user database,
                    this.userService.createUser({
                        isAnonymous, 
                        isLogin: true,
                        displayName,
                        photoURL,
                        userUid: uid,
                        score: 0,
                        role,
                        roomUid,
                    })
                ).pipe(
                    map(() => uid)
                )
            }),
            // switchMap((userUid: string) => {
            //     let roomUid: string;
            //     return from(
            //         //createRoom in my user database 
            //         this.roomService.createRoom(userUid)
            //             .then((room) => {
            //                 roomUid = room.key
            //                 return this.userService.updateRoom(userUid, roomUid)
            //             })
            //     ).pipe(map(() => ({userUid, roomUid})))
            // })
        ) 
    }
    
}