import { Injectable } from "@angular/core";
import {
  Database,
  list,
  ref,
  stateChanges,
  update,
} from "@angular/fire/database";
import { equalTo, orderByKey, query } from "@firebase/database";
import { AuthService } from "app/auth/auth.service";
import { User } from "app/auth/user.model";
import { Observable, Subject } from "rxjs";
import { switchMap, map, shareReplay } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(public auth: AuthService, public db: Database) {}

  userUid = new Subject<string>();
  userUid$ = this.userUid.asObservable();

  public user$ = this.userUid$.pipe(
    switchMap((userUid) => this.onUserStateChanged(userUid)),
    shareReplay(1)
  );

  onUserStateChanged(uid: string): Observable<User> {
    const user = ref(this.db, "users");
    const queryRes = query(user, orderByKey(), equalTo(uid));

    return stateChanges(queryRes).pipe(map((user) => user.snapshot.val()));
  }

  createUser(user: User) {
    return update(ref(this.db, "users/" + user.userUid), {
      isAnonymous: user.isAnonymous,
      userUid: user.userUid,
      displayName: user.displayName || "Annonymous",
      photoURL: user.photoURL || "",
      score: 0,
      roomUid: user.roomUid || null,
    });
  }

  updateBestScore(userUid: string, score: number) {
    const user = ref(this.db, "users/" + userUid);
    update(user, { bestScore: score });
  }

  updateScore(userUid: string, score: number) {
    const user = ref(this.db, "users/" + userUid);
    update(user, { score });
  }

  updateRoomUid(userUid: string, roomUid: string) {
    if (userUid == null) return;

    const user = ref(this.db, "users/" + userUid);

    return update(user, { roomUid });
  }

  updateIsLogin(userUid: string, isLogin: boolean) {
    if (userUid == null) return;

    const user = ref(this.db, "users/" + userUid);
    return update(user, { isLogin });
  }
}
