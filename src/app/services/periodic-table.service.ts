import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Element } from "app/models/element";

@Injectable()
export class PeriodicTableService {
  constructor(private http: HttpClient) {}

  public getPeriodicTable() {
    return this.http
      .get<Element[]>("../assets/periodicTable.json")
      .pipe(catchError((error: any) => Observable.throw(error)));
  }
}
