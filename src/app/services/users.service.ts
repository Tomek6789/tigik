import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthService } from "app/auth/auth.service";
import { User } from "app/auth/user.model";
import { BehaviorSubject, merge } from "rxjs";
import { filter, switchMap, tap, map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(public auth: AuthService, public database: AngularFireDatabase) {}

  user$ = this.auth.user$;
  users = this.database.list("users");

  user: User;
  private userDataSubject = new BehaviorSubject<User>(null);
  public userData$ = this.userDataSubject.asObservable();

  signIn$ = this.user$.pipe(
    filter(Boolean),
    switchMap(({ uid, displayName }) => {
      return this.database.list("/users").update(uid, { uid, displayName });
    })
  );

  loginUser$ = this.user$.pipe(
    filter<User>(Boolean),
    switchMap((user) =>
      this.database
        .list<User>("/users", (ref) => ref.orderByKey().equalTo(user.uid))
        .snapshotChanges()
    ),

    tap(([user]) => {
      this.user = {
        uid: user.key,
        ...user.payload.val(),
      };
      console.log("next", this.user);
      this.userDataSubject.next(this.user);
    })
  );

  logoutUser$ = this.user$.pipe(
    filter((user) => !user),
    tap(() => {
      console.log("logout, user", this.user);
      if (this.user && this.user.role) {
        const key = this.user.role === "host" ? "hostUser" : "guestUser";
        // remove user from room
        this.database.list("rooms").update(this.user.room, { [key]: null });
        this.updateRoomAndRole(null, null);
      }

      this.user = null;
    })
  );

  userApp$ = merge(this.signIn$, this.loginUser$, this.logoutUser$);

  updateBestScore(score: number) {
    if (!this.user) {
      console.log(
        "Jestes wylogowany, zaloguj sie jesli chcesz zapisywac wynik"
      );
      return;
    }
    this.users.update(this.user.uid, { bestScore: score });
  }

  updateScore(score: number) {
    if (!this.user) {
      console.log(
        "Jestes wylogowany, zaloguj sie jesli chcesz zapisywac wynik"
      );
      return;
    }
    this.users.update(this.user.uid, { score });
  }

  updateRoomAndRole(room: string, role: "host" | "guest") {
    if (this.user) {
      this.users.update(this.user.uid, { room, role });
    }
  }

  getUser(uid: string) {
    return this.database
      .list<User>("users", (ref) => ref.orderByKey().equalTo(uid))
      .valueChanges()
      .pipe(map(([user]) => user));
  }

  createVisitor(displayName: string) {
    const a = {
      displayName,
      isVisitor: true,
      score: 0,
    };
    const visitor = this.users.push(a);
    console.log("AA 2", visitor.key);

    this.database
      .list<User>("/users", (ref) => ref.orderByKey().equalTo(visitor.key))
      .snapshotChanges()
      .pipe(
        tap(([user]) => {
          this.user = {
            uid: user.key,
            ...user.payload.val(),
          };
          console.log("next - visitor", this.user);
          this.userDataSubject.next(this.user);
        })
      )
      // TO DO: UNSUBSCRIBE!
      .subscribe();
  }

  deleteVisitor() {
    if (this.user && this.user.isVisitor) {
      this.users.remove(this.user.uid);
    }
  }
}
