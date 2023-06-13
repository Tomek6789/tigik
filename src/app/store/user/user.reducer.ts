import { createReducer, on } from "@ngrx/store";
import { userIsLogIn, userStateChangedSuccess, signInUser, userIsLogOut, opponentStateChangedSuccess, removeOpponent } from "./user.actions";
import { User } from "app/auth/user.model";

export const usersFeatureKey = 'users';

export default interface UserState {
  user: {
    isAnonymous: boolean;
    isLogin: boolean;
    userUid: string;
    roomUid: string;
    score?: number;
    bestScore?: number;
    displayName?: string;
    photoURL?: string;
  }
  opponent: {
    isLogin: boolean;
    score?: number,
    bestScore?: number,
    displayName?: string,
    photoURL?: string,
  }
}

export type Opponent = Omit<UserState['opponent'], "hasOpponent">; 

export const initialState: UserState = {
  user: {
    isAnonymous: false,
    isLogin: false,
    userUid: null,
    roomUid: null,
    score: null,
    bestScore: null,
    displayName: null,
    photoURL: null,
  },
  opponent: {
    isLogin: false,
    score: null,
    bestScore: null,
    displayName: null,
    photoURL: null,
  }
};

export const reducerUser = createReducer(
  initialState,
    
  on(userStateChangedSuccess, (state, action) => ({ ...state, user: { ...state.user, ...action.user, }})),

  on(opponentStateChangedSuccess, (state, action) => ({ ...state, opponent: { ...state.opponent, ...action.opponent }})),
  
  on(removeOpponent, (state, action) => ({ ...state, opponent: { ...initialState.opponent }})),
);