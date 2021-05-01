import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthService } from "app/auth/auth.service";
import { User } from "app/auth/user.model";
import { BehaviorSubject, merge } from "rxjs";
import { filter, switchMap, tap, map, take } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(public auth: AuthService, public database: AngularFireDatabase) { }

  authChanged$ = this.auth.authStateChanged$;
  users = this.database.list("users");

  user: User;
  private authUserSubject = new BehaviorSubject<string>(null);
  public authUserUid$ = this.authUserSubject.asObservable()

  public user$ = this.authUserUid$.pipe(
    filter<string>(Boolean),
    switchMap(userUid => this.onUserStateChanged(userUid)),
    filter<User>(Boolean)
  );

  onUserStateChanged(uid: string) {
    return this.database
      .list<User>("users", (ref) => ref.orderByKey().equalTo(uid))
      .valueChanges()
      .pipe(
        map(([user]) => user),
        tap(user => this.user = user)
      )
  }

  getUser(uid: string) {
    return this.database.list<User>('users', ref => ref.orderByKey().equalTo(uid)).valueChanges().pipe(take(1), map(([user]) => user))
  }

  signIn$ = this.authChanged$.pipe(
    filter<User>(Boolean),
    tap((user) => {
      this.user = {
        uid: user.uid,
        displayName: user.displayName || 'Annonymous'
      }
      this.authUserSubject.next(user.uid);
      this.database.list("users").update(user.uid, this.user);
    }),
  );

  logoutUser$ = this.authChanged$.pipe(
    filter((user) => !user),
    tap((userA) => {
      console.log('LOGOUT', userA)
      if (this.user && this.user.role) {
        const key = this.user.role === "host" ? "hostUser" : "guestUser";
        // remove user from room
        this.database.list("rooms").update(this.user.roomUid, { [key]: null, startGame: false });
        this.updateRoomAndRole(null, null);
      }

      this.user = null;
      this.authUserSubject.next(null)
    }),

  );

  userApp$ = merge(this.signIn$, this.logoutUser$);

  updateBestScore(score: number) {
    this.users.update(this.user.uid, { bestScore: score });
  }

  updateScore(score: number) {
    this.users.update(this.user.uid, { score });
  }

  updateRoomAndRole(roomUid: string, role: "host" | "guest") {
    this.users.update(this.user.uid, { roomUid, role });
  }

}
