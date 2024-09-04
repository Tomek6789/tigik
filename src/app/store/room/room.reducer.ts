import { createReducer, on } from "@ngrx/store";
import { roomStateChangedSuccess, removeRoom, roomRemovedSuccess } from "./room.actions";

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
  winnerUid?: string;
  // this is for multiplayer mode
  // after 3 attempts, the game will be over
  attempt?: number;
}

export type Players = RoomState['players']; 

export const initialState: RoomState = {
  players: null
};

export const reducerRoom = createReducer(
  initialState,

  on(roomStateChangedSuccess, (state, action) => ({ ...action.room })),

);