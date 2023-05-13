import { createReducer } from "@ngrx/store";

export const roomFeatureKey = 'room';

export interface RoomState {
  
}

export const initialState: RoomState = {
};

export const reducerRoom = createReducer(
  initialState,
//   on(signInUserSuccess, (state, action) => ({ ...state, userUid: action.userUid })),
//   on(isUserLogIn, (state, action) => ({ ...state, isLogin: action.isLogin }))
);