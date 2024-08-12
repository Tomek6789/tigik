import { createAction, props } from "@ngrx/store";
import { User } from "app/auth/user.model";
import { Opponent } from "./user.reducer";

export const signForGuest = createAction(
    '[User] signForGuest',
    props<{ roomUid: string }>()
)

export const signInAsAnonymous = createAction(
    '[User] signInAsAnonymous'
)

export const startGameForAnonymous = createAction(
    '[User] startGameForAnonymous'
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

export const updateRoomUid = createAction(
   '[User] updateRoomUid',
   props<{ userUid: string, roomUid: string}>()
)

export const removeRoomUid = createAction(
    '[User] removeRoomUid',
    props<{ userUid: string }>()
)

export const updateIsLogin = createAction(
    '[User] updateIsLogin',
    props<{ isLogin: boolean, userUid: string }>()
)

// export const inviteOpponent = createAction(
//     '[Opponent] inviteOpponent',
//     props<{ roomUid: string }>()
// )
