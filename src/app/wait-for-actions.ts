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

export function waitForActions<T>(
    events: Action[],
    actions: Actions
  ): MonoTypeOperatorFunction<T> {
    const array = events.map((event) => createObservable(event, actions));

    return pipe(switchMap((action) => zip(...array).pipe(map(() => action))));
  }

  export function waitForProp<T>(
    key: string,
    store: Store<AppState>
  ): MonoTypeOperatorFunction<T> {
    const array = store.select(roomUidSelector).pipe(filter((Boolean)), first())

    return pipe(switchMap((action) => zip(array).pipe(map(() => action))));
  }

  export function waitForOpponent(
    store: Store<AppState>
  ) {
    const userUid = store.select(userUidSelector);
    const opponent = store.select(roomPlayersSelector).pipe(filter((players) => players?.length === 2))

    return pipe(switchMap(() => 
      combineLatest([userUid, opponent]).pipe(
        map(([userUid, players]) => {        
          return players.filter(uid => uid !== userUid)[0]
        
        })
      )
    ))
  }