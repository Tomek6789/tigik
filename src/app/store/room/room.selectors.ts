import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RoomState, roomFeatureKey } from "./room.reducer";

export const roomSelector = createFeatureSelector<RoomState>(roomFeatureKey);

// export const guestUidSelector = createSelector(
//     roomSelector,
//     room => room.guestUid
// )

// export const hostUidSelector = createSelector(
//     roomSelector,
//     room => room.hostUid
// )

export const roomPlayersSelector = createSelector(
    roomSelector,
    room => room.players 
)

export const startGameSelector = createSelector(
    roomSelector,
    room => room.startGame
)

export const searchingElementSelector = createSelector(
    roomSelector,
    room => room.searchingElement
)