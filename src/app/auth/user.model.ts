export type Role = "host" | "guest";

export interface User {
  uid: string;
  email?: string;
  score?: number;
  bestScore?: number;
  roomUid?: string;
  role?: Role;
  photoURL?: string;
  displayName?: string;
}
