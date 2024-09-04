import { Injectable } from "@angular/core";
import { Database, ref, list, update, stateChanges, equalTo, get, remove, orderByKey, push, query, set, onChildRemoved  } from "@angular/fire/database";
import { Players } from "app/store/room/room.reducer";
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

  roomRemoved = new Subject()
  roomRemoved$ = this.roomRemoved.asObservable()

  onMyRoomStateChanged(roomUid: string): Observable<Room> {
    const room = ref(this.db, 'rooms');
    const queryRes = query(room, orderByKey(), equalTo(roomUid));

    return stateChanges(queryRes)
      .pipe(map(room => {
        if(room.event === 'child_removed') {
          this.roomRemoved.next()
          return {}
        }
        return  room.snapshot.val()
      }))
  }

  createRoom(hostUid: string) {
    return push(ref(this.db, 'rooms'), {
        players: { hostUid },
        startGame: false,
        searchingElement: null,
        attempt: 0,
      });
  }


  async joinRoom(roomUid: string, opponentUid: string) {
    const roomPlayers = ref(this.db, ('rooms/' + roomUid + '/players'))
    return update(roomPlayers, { opponentUid });
  }

  removeRoom(roomUid: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    remove(room)
  }

  removeOpponentFromRoom(roomUid: string, players: Players) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { players });
  }


  async startGame(roomUid: string, status: boolean) {
    if(roomUid === null) return

    const room = ref(this.db, ('rooms/' + roomUid))
    this.roomUid.next(roomUid)
    return update(room, {
      startGame: status,
    });
  }

  searchingElement(roomUid: string, element: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { searchingElement: element, animate: null });
  }

  animate(roomUid: string, element: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { animate: element, searchingElement: null })
  }

  winnerUid(roomUid: string, userUid: string) {
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { winnerUid: userUid, animate: null })
  }

  clearAnimate(roomUid: string) {
    if(roomUid === null) return

    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { animate: null, })  
  }

  setAttempt(roomUid: string, attempt: number) {
    if( roomUid === null) return
    const room = ref(this.db, ('rooms/' + roomUid))
    update(room, { attempt: attempt + 1 })
  }
}
