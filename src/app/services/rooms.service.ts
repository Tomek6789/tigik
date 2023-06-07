import { Injectable } from "@angular/core";
import { Database, ref, list, update, stateChanges, equalTo } from "@angular/fire/database";
import { child, onValue, orderByKey, push, query, remove } from "@firebase/database";
import { AuthService } from "app/auth/auth.service";
import { User } from "app/auth/user.model";
import { Subject, Observable } from "rxjs";
import { filter, map, shareReplay, switchMap, tap } from "rxjs/operators";
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
    public db: Database
      ) { }

  roomUid = new Subject<string>()
  roomUid$ = this.roomUid.asObservable()

  onMyRoomStateChanged(roomUid: string): Observable<Room> {
    console.log(roomUid)
    const room = ref(this.db, 'rooms');
    const queryRes = query(room, orderByKey(), equalTo(roomUid));

    console.log('get room')
    return stateChanges(queryRes)
      .pipe(map(user => user.snapshot.val()))
  }

  createRoom(hostUid: string) {
    return push(ref(this.db, 'rooms'), {
        hostUid,
        guestUid: null,
        startGame: false,
        searchingElement: null,
      });
  }


  joinRoom(roomUid: string, guestUid: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { guestUid });
  }

  removeRoom(roomUid: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    remove(room)
  }

  removeUserFromRoom(roomUid: string, role: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { [role]: null });
  }

  async startGame(roomUid: string, status: boolean, element: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    this.roomUid.next(roomUid)
    return await update(room, {
      startGame: status,
      searchingElement: element,
    });
  }

  searchingElement(roomUid: string, element: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { searchingElement: element });
  }

}
