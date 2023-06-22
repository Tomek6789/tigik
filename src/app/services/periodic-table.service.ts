import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { Element } from "app/models/element";

@Injectable()
export class PeriodicTableService {
  constructor(private http: HttpClient) { }

  public getPeriodicTable() {
    return this.http
      .get<Element[]>("../assets/periodicTable.json")
      .pipe(
        map((elements) => (elements.map((element) => ({ ...element, animate: false })))),
        tap(console.log),
        catchError((error: any) => Observable.throw(error)));
  }
}
