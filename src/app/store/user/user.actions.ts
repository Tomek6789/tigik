import { createAction, props } from "@ngrx/store";

export const signInUser = createAction(
    '[User] signInUser' 
)

export const signInUserSuccess = createAction(
    '[User] signInUser Success',
    props<{ userUid: string, roomUid: string }>()
)

export const setUser = createAction(
    '[User] setUser',
)

export const setUserSuccess = createAction(
    '[User] setUserSuccess',
    props<{ userUid: string, roomUid: string }>()
)

export const getLoginUser = createAction(
    '[User] getLoginUser'
)

export const isUserLogIn = createAction(
    '[User] isUserLogIn',
    props<{ isLogin: boolean }>()
)
