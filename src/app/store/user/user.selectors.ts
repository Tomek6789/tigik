import { createFeatureSelector, createSelector } from "@ngrx/store";
import UserState, { usersFeatureKey } from "./user.reducer";
import { roomPlayersSelector } from "../room/room.selectors";

export const selectUsers = createFeatureSelector<UserState>(usersFeatureKey);

export const userSelector = createSelector(
    selectUsers,
    users => users.user
) 

export const isUserLoginSelector = createSelector(
    userSelector,
    user => user.isLogin
)

export const userUidSelector = createSelector(
    userSelector,
    user => user.userUid
)

export const roomUidSelector = createSelector(
    userSelector,
    user => user.roomUid
)

export const scoreSelector = createSelector(
    userSelector,
    user => user.score
)

export const bestScoreSelector = createSelector(
    userSelector,
    user => user.bestScore
)

export const opponentSelector = createSelector(
    selectUsers,
    users => users.opponent
)

export const showInviteSelector = createSelector(
    opponentSelector,
    opponent => !opponent.isLogin
)

export const isAnonymousSelector = createSelector(
    userSelector,
    user => user.isAnonymous
)

