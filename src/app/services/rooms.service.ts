import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { User } from "app/auth/user.model";
import { map, tap } from "rxjs/operators";

export interface Room {
  key?: string;
  guestUid: string;
  hostUid: string;
  startGame: boolean;
  searchingElement: string;
}

export type PeriodicTableRoom = Pick<Room, "startGame" | "searchingElement">;

@Injectable({
  providedIn: "root",
})
export class RoomsService {
  constructor(
    private database: AngularFireDatabase,
  ) { }

  rooms = this.database.list<Room>("rooms");
  rooms$ = this.rooms.snapshotChanges().pipe(
    map((data) => {
      return data.map((c) => ({ key: c.payload.key, ...c.payload.val() }));
    }),
    tap(() => console.log('snapshot'))
  );

  joinRoom(key: string, guestUid: string) {
    this.rooms.update(key, { guestUid });
  }

  createRoom(hostUid: string) {
    return this.rooms.push({
      hostUid,
      guestUid: null,
      startGame: false,
      searchingElement: null,
    });
  }

  removeRoom(roomKey: string) {
    this.rooms.remove(roomKey);
  }

  removeUserFromRoom(roomKey: string, role: string) {
    this.rooms.update(roomKey, { [role]: null });
  }

  startGame(roomKey: string, status: boolean, element: string) {
    this.rooms.update(roomKey, {
      startGame: status,
      searchingElement: element,
    });
  }

  searchingElement(key: string, element: string) {
    this.rooms.update(key, { searchingElement: element });
  }

  onMyRoomStateChanged(roomUid) {
    return this.database
      .list<Room>("rooms", (ref) => {
        return ref.orderByKey().equalTo(roomUid);
      })
      .valueChanges().pipe(map(([room]) => room));
  }
}
