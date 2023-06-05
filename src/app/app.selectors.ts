import { createSelector } from "@ngrx/store";
import { userRoleSelector } from "./store/user/user.selectors";
import { guestUidSelector, hostUidSelector } from "./store/room/room.selectors";

export const opponentUidSelector = createSelector(
    userRoleSelector,
    guestUidSelector,
    hostUidSelector,
    (role, guestUid, hostUid) => role === 'host' ? guestUid : hostUid
)