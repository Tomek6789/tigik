import { Actions } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { combineLatest, MonoTypeOperatorFunction, pipe, zip } from "rxjs";
import { filter, first, map, switchMap, tap } from "rxjs/operators";
import { roomUidSelector, userUidSelector } from "./store/user/user.selectors";
import { AppState } from "./app.module";
import { roomPlayersSelector } from "./store/room/room.selectors";

function createObservable(event: Action, actions: Actions) {
    return actions.pipe(
      filter((item) => item.type === event.type),
      first()
    );
  }

// export function waitForActions<T>(
//     events: Action[],
//     actions: Actions
//   ): MonoTypeOperatorFunction<T> {
//     const array = events.map((event) => createObservable(event, actions));

//     return pipe(switchMap((action) => zip(...array).pipe(map(() => action))));
//   }

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