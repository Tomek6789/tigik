import { createReducer, on } from "@ngrx/store";
import { isUserLogIn, setUserSuccess, signInUser, signInUserSuccess } from "./user.actions";

export const userFeatureKey = 'user';

export interface UserState {
  isLogin: boolean;
  userUid: string;
  roomUid: string;
}

export const initialState: UserState = {
  isLogin: false,
  userUid: null,
  roomUid: null,
};

export const reducerUser = createReducer(
  initialState,
  on(signInUserSuccess, setUserSuccess, (state, action) => ({ ...state, userUid: action.userUid, roomUid: action.roomUid })),
  on(isUserLogIn, (state, action) => ({ ...state, isLogin: action.isLogin })),
);