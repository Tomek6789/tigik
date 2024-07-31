import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RoomState, roomFeatureKey } from "./room.reducer";

export const roomSelector = createFeatureSelector<RoomState>(roomFeatureKey);


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

export const animateElementSelector = createSelector(
    roomSelector,
    room => room.animate
)


export const foundElementSelector = createSelector(
    roomSelector,
    room => room.foundElement
)