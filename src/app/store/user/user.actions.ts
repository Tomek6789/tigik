import { createAction, props } from "@ngrx/store";
import { User } from "app/auth/user.model";
import { Opponent } from "./user.reducer";

export const signInAsAnonymous = createAction(
    '[User] signInAsAnonymous'
)

export const signInAsAnonymousSuccess = createAction(
    '[User] signInAsAnonymousSuccess'
)

export const signInUser = createAction(
    '[User] signInUser' 
)

export const signOutUser = createAction(
    '[User] signOutUser'
)

export const getUser = createAction(
    '[User] getUser',
    props<{ userUid: string }>()
)

export const userStateChangedSuccess = createAction(
    '[User] userStateChangedSuccess',
    props<{ user: User }>()
)

export const getLoginUser = createAction(
    '[User] getLoginUser',
    props<{ roomUid: string }>()
)

export const userIsLogIn = createAction(
    '[User] userIsLogIn',
    props<{ userUid: string }>()
)
export const userIsLogOut = createAction(
    '[User] userIsLogOut',
)

export const getOpponent = createAction(
    '[Opponent] getOpponent',
)

export const removeOpponent = createAction(
    '[Opponent] removeOpponent',
)

export const opponentStateChangedSuccess = createAction(
    '[Opponent] opponentStateChangedSuccess',
    props<{ opponent: Opponent }>()
)

export const inviteOpponent = createAction(
    '[Opponent] inviteOpponent',
    props<{ roomUid: string }>()
)