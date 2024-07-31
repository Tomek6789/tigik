import { createReducer, on } from "@ngrx/store";
import { roomStateChangedSuccess, removeRoom } from "./room.actions";

export const roomFeatureKey = 'room';

export interface RoomState {
  key?: string;
  players?: {
    hostUid: string;
    opponentUid: string;
  }
  startGame?: boolean;
  searchingElement?: string;
  animate?: string;
  foundElement?: string;
}

export const initialState: RoomState = {
  players: null
};

export const reducerRoom = createReducer(
  initialState,

  on(roomStateChangedSuccess, (state, action) => ({ ...action.room })),

  // on(removeRoom, () => initialState)
);