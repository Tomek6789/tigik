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

export const winnerUidSelector = createSelector(
    roomSelector,
    room => room.winnerUid
)


export const attemptSelector = createSelector(
    roomSelector,
    room => room.attempt
)


export const isSinglePlayerModeSelector = createSelector(
    roomSelector,
    room => {
        if(room.players) {

         return   Object.keys(room.players).length === 1
        } else {
            false
        }
    }
)

export const resetProgressBarSelector = createSelector(
    searchingElementSelector,
    startGameSelector,
    (element, startGame) => element && startGame
)