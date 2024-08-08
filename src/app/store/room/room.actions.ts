import { createEffect } from "@ngrx/effects";
import { createAction, props } from "@ngrx/store";
import { RoomState } from "./room.reducer";

export const startGame = createAction(
    '[Room] startGame'
)

export const startGameSuccess = createAction(
    '[Room] startGameSuccess'
)


export const finishGame = createAction(
    '[Room] Finish Game'
)

export const selectedElement = createAction(
    '[Room] selectedElement',
    props<{ selectedElement: string }>()
)

export const getRoom = createAction(
    '[Room] getRoom',
    props<{ roomUid: string }>()
)

export const roomStateChangedSuccess = createAction(
    '[Room] roomStateChangedSuccess',
    props<{ room: RoomState }>()
)

export const getRoomFailure = createAction(
    '[Room] getRoomFailure'
)

export const removeRoom = createAction(
    '[Room] removeRoom',
)

export const playerLeaveRoom = createAction(
    '[Room] playerLeaveRoom'
)

export const createRoom = createAction(
    '[Room] createRoom',
    // userUid for which we need to create room
    // then we add user to room/players
    props<{ userUid: string}>()
)

export const createRoomSuccess = createAction(
    '[Room] createRoomSuccess'
)

export const joinRoom = createAction(
    '[Room] joinRoom',
    props<{ roomUid: string; userUid: string }>()
)

export const joinRoomSuccess = createAction(
    '[Room] joinRoomSuccess'
)

export const roomRemovedSuccess = createAction(
    '[Room] roomRemovedSuccess'
)

export const listenRoomRemoved = createAction(
    '[Room] listenRoomRemoved',
)