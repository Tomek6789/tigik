import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthService } from "app/auth/auth.service";
import { User } from "app/auth/user.model";
import { BehaviorSubject, merge } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(public auth: AuthService, public database: AngularFireDatabase) {}

  user$ = this.auth.user$;
  users = this.database.list("users");

  user: User;
  userData$ = new BehaviorSubject<User>(null);

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
      this.userData$.next(this.user);
    })
  );

  logoutUser$ = this.user$.pipe(
    filter((user) => !user),
    tap(() => {
      if (this.user) {
        const key = this.user.role === "host" ? "hostUser" : "guestUser";
        // remove user from room
        this.database.list("rooms").update(this.user.room, { [key]: null });
        this.updateRoomAndRole(null, null);
      }

      this.user = null;
    })
  );

  userApp$ = merge(this.signIn$, this.loginUser$, this.logoutUser$);

  updateScore(score: number) {
    if (!this.user) {
      console.log(
        "Jestes wylogowany, zaloguj sie jesli chcesz zapisywac wynik"
      );
      return;
    }
    this.users.update(this.user.uid, { bestScore: score });
  }

  updateElement(symbol: string) {
    if (!this.user) {
      console.log("Jestes wylogowany");
      return;
    }
    this.users.update(this.user.uid, { elementSelected: symbol });
  }

  updateRoomAndRole(room: string, role: "host" | "guest") {
    this.users.update(this.user.uid, { room, role });
  }

  getUser(uid: string) {
    return this.database
      .list<User>("users", (ref) => ref.orderByKey().equalTo(uid))
      .valueChanges();
  }

  createVisitor() {
    const a = {
      isVisitor: true,
      displayName: "Visitor",
    };
    const visitor = this.users.push(a);

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
          this.userData$.next(this.user);
        })
      )
      // TO DO: UNSUBSCRIBE!
      .subscribe();
  }

  deleteVisitor() {
    if (this.user && this.user.isVisitor) {
      this.users.remove(this.user.uid);
      const key = this.user.role === "host" ? "hostUser" : "guestUser";
      // remove user from room
      this.database.list("rooms").update(this.user.room, { [key]: null });
    }
  }
}