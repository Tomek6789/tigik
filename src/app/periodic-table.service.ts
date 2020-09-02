import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

@Injectable()
export class PeriodicTableService {
  constructor(private http: HttpClient) {}

  public getPeriodicTable() {
    return this.http
      .get("../assets/periodicTable.json")
      .pipe(catchError((error: any) => Observable.throw(error)));
  }
}
