import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { User } from "app/auth/user.model";
import { UserService } from "app/users/users.service";
import {
  map,
  take,
  tap,
  filter,
  switchMap,
  share,
  shareReplay,
} from "rxjs/operators";

interface Room {
  guestUser: Partial<User>;
  hostUser: Partial<User>;
  name: string;
  startGame: boolean;
  searchingElement: string;
  player: "host" | "guest";
}

@Injectable({
  providedIn: "root",
})
export class RoomsService {
  constructor(
    private database: AngularFireDatabase,
    private userService: UserService
  ) {}

  rooms = this.database.list<Room>("rooms");
  rooms$ = this.rooms.snapshotChanges().pipe(
    map((data) => {
      return data.map((c) => ({ key: c.payload.key, ...c.payload.val() }));
    })
  );

  myRoom = null;

  myRoom$ = this.userService.userData$.pipe(
    filter(Boolean),
    switchMap(({ uid, role }) => {
      return this.database
        .list<Room>("rooms", (ref) => {
          const key = role === "host" ? "hostUser" : "guestUser";
          return ref.orderByChild(`${key}/uid`).equalTo(uid);
        })
        .valueChanges();
    }),
    map(([myRoom]) => {
      this.myRoom = myRoom;
      return myRoom;
    }),
    filter(Boolean),
    shareReplay(1)
  );

  joinRoom(key: string) {
    this.userService.userData$.pipe(take(1)).subscribe((user) => {
      this.rooms.update(key, { guestUser: user });
    });
  }

  createRoom(user: User) {
    return this.rooms.push({
      name: "test",
      hostUser: user,
      guestUser: null,
      startGame: false,
      searchingElement: null,
      player: "host",
    });
  }

  removeRoom(roomKey: string) {
    this.rooms.remove(roomKey);
  }

  startGame(roomKey: string, status: boolean, element: string) {
    this.rooms.update(roomKey, {
      startGame: status,
      searchingElement: element,
      player: "host",
    });
  }

  searchingElement(key: string, element: string) {
    const player = this.myRoom.player === "host" ? "guest" : "host";
    this.rooms.update(key, { searchingElement: element, player });
  }
}
