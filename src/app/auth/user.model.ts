export type Role = "host" | "guest";

export interface User {
  isAnonymous: boolean;
  isLogin: boolean;
  userUid: string;
  score?: number;
  bestScore?: number;
  roomUid?: string;
  role?: Role;
  displayName?: string;
  photoURL?: string;
}
