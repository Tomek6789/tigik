import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { User } from "app/auth/user.model";
import { UserService } from "app/services/users.service";
import { BehaviorSubject } from "rxjs";
import { filter, map, shareReplay, switchMap, tap } from "rxjs/operators";

export interface Room {
  guestUserUid: string;
  hostUserUid: string;
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
    private userService: UserService
  ) { }

  rooms = this.database.list<Room>("rooms");
  rooms$ = this.rooms.snapshotChanges().pipe(
    map((data) => {
      return data.map((c) => ({ key: c.payload.key, ...c.payload.val() }));
    })
  );

  myRoom = null;

  // trol = new BehaviorSubject(null);
  // trol$ = this.trol.asObservable();
  // trolValue = this.trol.getValue();

  // public nextRoom(user: User) {
  //   this.trol.next(user)
  // }




  // myRoom$ = this.userService.authUser$.pipe(
  //   filter(Boolean),
  //   switchMap(({ uid, room }) => {
  //     console.log('SWITCH MAP', room)
  //     return this.database
  //       .list<Room>("rooms", (ref) => {
  //         // const key = role === "host" ? "hostUserUid" : "guestUserUid";
  //         return ref.orderByChild(`${room}`).equalTo(uid);
  //       })
  //       .valueChanges();
  //   }),
  //   map(([myRoom]) => {
  //     this.myRoom = myRoom;

  //     console.log('myROOm', myRoom)
  //     return myRoom;
  //   }),
  //   filter<Room>(Boolean),
  //   shareReplay(1)
  // );

  joinRoom(key: string, guestUid: string) {
    this.rooms.update(key, { guestUserUid: guestUid });
  }

  createRoom(hostUid: string) {
    return this.rooms.push({
      hostUserUid: hostUid,
      guestUserUid: null,
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

  onMyRoomStateChanged(roomUid, playerUid) {
    return this.database
      .list<Room>("rooms", (ref) => {
        return ref.orderByKey().equalTo(roomUid);
      })
      .valueChanges().pipe(map(([room]) => room));
  }
}
