import { createFeatureSelector, createSelector } from "@ngrx/store";
import { userFeatureKey, UserState } from "./user.reducer";

export const selectUser = createFeatureSelector<UserState>(userFeatureKey);

export const isUserLoginSelector = createSelector(
    selectUser,
    user => user.isLogin
)

export const userUidSelector = createSelector(
    selectUser,
    user => user.userUid
)


export const roomUidSelector = createSelector(
    selectUser,
    user => user.roomUid
)

