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
)

export const getRoomSuccess = createAction(
    '[Room] getRoomSuccess',
    props<{ room: RoomState }>()
)

export const removeRoom = createAction(
    '[Room] removeRoom',
)

export const playerLeaveRoom = createAction(
    '[Room] playerLeaveRoom'
)

// export const guestLeaveRoom = createAction(
//     '[Room] guestLeaveRoom'
// )

// export const hostLeaveRoom = createAction(
//     '[Room] hostLeaveRoom'
// )

export const createRoom = createAction(
    '[Room] createRoom'
)
