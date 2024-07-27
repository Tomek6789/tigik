import { Injectable } from "@angular/core";
import { Database, ref, list, update, stateChanges, equalTo, get, remove, orderByKey, push, query, set,  } from "@angular/fire/database";
import { Subject, Observable } from "rxjs";
import { map, } from "rxjs/operators";

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
        players: [hostUid],
        startGame: false,
        searchingElement: null,
      });
  }


  joinRoom(roomUid: string, playersUid: string[]) {
    const room = ref(this.db, ('rooms/' + roomUid))
    return update(room, { players: playersUid });
  }

  removeRoom(roomUid: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    remove(room)
  }

  removeUserFromRoomPlayers(roomUid: string, playersUid: string[]) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { players: playersUid });
  }


  async startGame(roomUid: string, status: boolean, element: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    this.roomUid.next(roomUid)
    return update(room, {
      startGame: status,
      searchingElement: element,
    });
  }

  searchingElement(roomUid: string, element: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { searchingElement: element });
  }

  animate(roomUid: string, element: string, userUid: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { animate: element, foundElement: userUid, searchingElement: null })
  }

  clearAnimate(roomUid: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { animate: null, foundElement: null })  }

}
