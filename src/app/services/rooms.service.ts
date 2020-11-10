import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { UserService } from "app/services/users.service";
import { filter, map, shareReplay, switchMap } from "rxjs/operators";

export interface Room {
  guestUserUid: string;
  hostUserUid: string;
  hostUserName: string;
  guestUserName: string;
  name: string;
  startGame: boolean;
  searchingElement: string;
  player: "host" | "guest";
}

export type PeriodicTableRoom = Pick<Room, "startGame" | "searchingElement">;

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
          const key = role === "host" ? "hostUserUid" : "guestUserUid";
          return ref.orderByChild(`${key}`).equalTo(uid);
        })
        .valueChanges();
    }),
    map(([myRoom]) => {
      this.myRoom = myRoom;
      return myRoom;
    }),
    filter<Room>(Boolean),
    shareReplay(1)
  );

  joinRoom(key: string, uid: string) {
    this.rooms.update(key, { guestUserUid: uid });
  }

  createRoom(uid: string, hostName: string) {
    return this.rooms.push({
      name: "test",
      hostUserUid: uid,
      hostUserName: hostName,
      guestUserUid: null,
      guestUserName: null,
      startGame: false,
      searchingElement: null,
      player: "host",
    });
  }

  removeRoom(roomKey: string) {
    this.rooms.remove(roomKey);
  }

  removeGuestFromRoom(roomKey: string) {
    this.rooms.update(roomKey, { guestUserUid: null });
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
