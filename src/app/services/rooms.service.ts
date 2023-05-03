import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthService } from "app/auth/auth.service";
import { User } from "app/auth/user.model";
import { filter, map, switchMap, tap } from "rxjs/operators";
import { UserService } from "./users.service";

export interface Room {
  key?: string;
  guestUid?: string;
  hostUid?: string;
  startGame?: boolean;
  searchingElement?: string;
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

  joinRoom(key: string, guestUid: string) {
    this.rooms.update(key, { guestUid });
  }

  createRoom(hostUid: string = 'temporary') {
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

  onMyRoomStateChanged(roomUid: string) {
    return this.database
      .list<Room>("rooms", (ref) => {
        return ref.orderByKey().equalTo(roomUid);
      })
      .valueChanges().pipe(map(([room]) => room));
  }
}
