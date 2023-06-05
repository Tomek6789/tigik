import { Injectable } from "@angular/core";
import { Database, list, ref, stateChanges, update } from "@angular/fire/database";
import { equalTo, orderByKey, query } from "@firebase/database";
import { AuthService } from "app/auth/auth.service";
import { Role, User } from "app/auth/user.model";
import { BehaviorSubject, from, iif, merge, Observable, of, Subject } from "rxjs";
import { filter, switchMap, tap, map, take, shareReplay } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(public auth: AuthService, public db: Database) { }


  userUid = new Subject<string>()
  userUid$ = this.userUid.asObservable()

  public user$ = this.userUid$.pipe(
    switchMap((userUid) =>this.onUserStateChanged(userUid)),
    tap((us) => console.log('USER$', us)),
    shareReplay(1)
  )

  onUserStateChanged(uid: string): Observable<User> {
    const user = ref(this.db, 'users');
    const queryRes = query(user, orderByKey(), equalTo(uid));

    return stateChanges(queryRes)
      .pipe(map(user => user.snapshot.val()))
  }

  createUser(user: User) {
    return update(ref(this.db, 'users/' + user.userUid), 
      {
        isAnonymous: user.isAnonymous,
        userUid: user.userUid,
        displayName: user.displayName || 'Annonymous',
        photoURL: user.photoURL || 'missing',
        score: 0,
        role: user.role,
        roomUid: user.roomUid || null,
      });
  }

  updateBestScore(userUid: string, score: number) {
    const user = ref(this.db, ('users/' + userUid))
    update(user, { bestScore: score })
  }

  updateScore(userUid: string, score: number) {
    const user = ref(this.db, ('users/' + userUid))
    update(user, { score })
  }

  updateRoom(userUid: string, roomUid: string) {
    const user = ref(this.db, ('users/' + userUid))
    return update(user, {  roomUid  })
  }

  updateIsLogin(userUid: string, isLogin: boolean) {
    const user = ref(this.db, ('users/' + userUid));
    return update(user, { isLogin })
  }

  updateRole(userUid: string, role: Role) {
    const user = ref(this.db, ('users/' + userUid));
    return update(user, { role })
  }

}
