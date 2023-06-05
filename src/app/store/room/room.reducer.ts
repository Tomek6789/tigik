import { createReducer, on } from "@ngrx/store";
import { getRoomSuccess, removeRoom } from "./room.actions";

export const roomFeatureKey = 'room';

export interface RoomState {
  key?: string;
  guestUid?: string;
  hostUid?: string;
  startGame?: boolean;
  searchingElement?: string;
}

export const initialState: RoomState = {
};

export const reducerRoom = createReducer(
  initialState,

  on(getRoomSuccess, (state, action) => ({ ...action.room })),

  // on(removeRoom, () => initialState)
);