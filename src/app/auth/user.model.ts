export interface User {
  uid: string;
  email?: string;
  elementSelected?: string;
  score?: number;
  bestScore?: number;
  room?: string;
  role?: "host" | "guest";
  isVisitor?: boolean;

  photoURL?: string;
  displayName?: string;
  myCustomData?: string;
}
