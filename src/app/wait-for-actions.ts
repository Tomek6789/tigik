import { Actions } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { MonoTypeOperatorFunction, pipe, zip } from "rxjs";
import { filter, first, map, switchMap, tap } from "rxjs/operators";
import { roomUidSelector } from "./store/user/user.selectors";
import { AppState } from "./app.module";
import { guestUidSelector, hostUidSelector } from "./store/room/room.selectors";

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


  export function waitForProp2<T>(
    key: string,
    store: Store<AppState>
  ): MonoTypeOperatorFunction<T> {
    const one = store.select(hostUidSelector).pipe(filter((Boolean)), first())
    const two = store.select(guestUidSelector).pipe(filter((Boolean)), first())

    return pipe(switchMap((action) => zip(...[one, two]).pipe(map(() => action))));
  }