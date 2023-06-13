import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "app/auth/auth.service";
import { getLoginUser, userIsLogIn, getUser, userStateChangedSuccess, signInUser, userIsLogOut, signOutUser, getOpponent, opponentStateChangedSuccess, signInAsAnonymous, startGameForAnonymous, signForGuest } from './user.actions'
import { filter, map, mergeMap, switchMap ,  tap } from 'rxjs/operators'
import { from, of, pipe } from "rxjs";
import { Injectable } from "@angular/core";
import { UserService } from "app/services/users.service";
import { UserCredential} from '@firebase/auth'
import { createRoom, getRoom, joinRoom, playerLeaveRoom } from "../room/room.actions";
import { Action, Store } from "@ngrx/store";
import { roomUidSelector, userUidSelector } from "./user.selectors";
import { waitForOpponent } from "app/wait-for-actions";
import { AppState } from "app/app.module";
import {  Test } from "app/services/callable-functions";


@Injectable({ providedIn: 'root'})
export class UserEffects {

    getLoginUser$ = createEffect(() => this.actions$.pipe(
        ofType(getLoginUser), 
        switchMap(({ roomUid }) => {
            return  this.auth.authStateChanged$.pipe(map((userUid) => ({ userUid, roomUid })));
        }),
        mergeMap(({ userUid, roomUid }) => {
            console.log('Auth change', {roomUid, userUid })
            const actions: Action[] = []
            if(userUid) {
                actions.push(userIsLogIn({userUid}), getOpponent(), getUser({ userUid }))
            } 

            if(roomUid && userUid != null) {
                actions.push(joinRoom({roomUid, userUid}), getRoom({ roomUid }))
            } 
            
            if(userUid && roomUid == null){
                actions.push(createRoom())
            }

            if(userUid == null){
                if(this.auth.userCreated) {
                    actions.push(userIsLogOut())
                } else {
                    actions.push(signInAsAnonymous())
                }
            }

            return actions;
        })
    ))

    signIn$ = createEffect(() => this.actions$.pipe(
        ofType(signInUser), 
        switchMap(() => {
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
    ), { dispatch: false })

    signOut$ = createEffect(() => 
        this.actions$.pipe(
            ofType(signOutUser),
            tap(() => {
                this.auth.signOut()
            })
        ), { dispatch: false })

    logIn$ = createEffect(() => this.actions$.pipe(
        ofType(userIsLogIn),
        tap(({ userUid }) => {
            this.userService.updateIsLogin(userUid, true)
        })
    ), { dispatch: false })

    logOut$ = createEffect(() => this.actions$.pipe(
        ofType(userIsLogOut),
        concatLatestFrom(() => [
            this.store.select(userUidSelector),
        ]),
        tap(([action, userUid]) => {
            this.userService.updateIsLogin(userUid, false)
        }),
        map(() => {
            return playerLeaveRoom()
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
        waitForOpponent(this.store),
        switchMap((opponentUid) => {
            return this.userService.onUserStateChanged(opponentUid)
        }),
        map((opponent) => {
           return opponentStateChangedSuccess({ opponent })
        })
    ))

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private auth: AuthService,
        private userService: UserService,
        private callableFunctions: Test
      ) {}

    private createUser() {
        return pipe(
            // filter((user: UserCredential) => {
            //     return user.user.metadata.creationTime === user.user.metadata.lastSignInTime 
            // }),
            switchMap(({ user: { displayName, photoURL , uid, isAnonymous }}: UserCredential) => {
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
                    })
                ).pipe(
                    map(() => uid)
                )
            }),
        ) 
    }
    
}