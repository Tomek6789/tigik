import { Store } from "@ngrx/store";
import { combineLatest,  pipe } from "rxjs";
import { filter,  map, switchMap } from "rxjs/operators";
import {  userUidSelector } from "./store/user/user.selectors";
import { AppState } from "./app.module";
import { roomPlayersSelector } from "./store/room/room.selectors";


  export function waitForOpponent(
    store: Store<AppState>
  ) {
    const userUid = store.select(userUidSelector);

    //because we need to wait for opponent to join the room
    //when opponent join the room, hostUser is already available
    const players = store.select(roomPlayersSelector).pipe(filter(players => Boolean(players?.opponentUid)))

    return pipe(switchMap(() => 
      combineLatest([userUid, players]).pipe(
        map(([userUid, players]) => {        
          const hostUid = players.hostUid;
          const opponentUid = players.opponentUid;

          return userUid === hostUid ? opponentUid : hostUid;
        
        })
      )
    ))
  }