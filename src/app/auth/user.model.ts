export interface User {
  isAnonymous: boolean;
  isLogin: boolean;
  userUid: string;
  score?: number;
  bestScore?: number;
  roomUid?: string;
  displayName?: string;
  photoURL?: string;
}
