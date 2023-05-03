import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthService } from "app/auth/auth.service";
import { User } from "app/auth/user.model";
import { BehaviorSubject, from, iif, merge, of } from "rxjs";
import { filter, switchMap, tap, map, take, shareReplay } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(public auth: AuthService, public database: AngularFireDatabase) { }

  authChanged$ = this.auth.authStateChanged$;
  users = this.database.list("users");

  user: User;
  isLogin: boolean


  public user$ = this.authChanged$.pipe(
    // filter<User>(Boolean),
    tap((user) => {
      this.user = user
      this.isLogin = Boolean(user)
    }),
    switchMap((user) => {
      console.log('switchmap user', user)
      if(user) {
        return from(this.createUser(user)).pipe(switchMap(() => this.onUserStateChanged(user.uid)))
      } else {
        return  of(user) // null
      }
    }),
    tap((user) => {
      this.user = user
      this.isLogin = Boolean(user)
    }),
    filter<User>(Boolean),
    shareReplay(1),

  );

  onUserStateChanged(uid: string) {
    return this.database
      .list<User>("users", (ref) => ref.orderByKey().equalTo(uid))
      .valueChanges()
      .pipe(
        map(([user]) => user),
      )
  }

  logoutUser$ = this.authChanged$.pipe(
    filter((user) => user === null),
    tap((userA) => {
      this.isLogin = false
      this.user = null
    }),

  );


  createUser(user: User) {
    return this.users.update(user.uid, {
      uid: user.uid,
      displayName: user.displayName || 'Annonymous',
      photoURL: user.photoURL,
      score: 0,
    })
  }

  updateBestScore(score: number) {
    this.users.update(this.user.uid, { bestScore: score });
  }

  updateScore(score: number) {
    console.log(this.user.uid)
    this.users.update(this.user.uid, { score });
  }

  updateRoomAndRole(roomUid: string, role: "host" | "guest") {
    this.users.update(this.user.uid, { roomUid, role });
  }

}
