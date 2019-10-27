import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PeriodicTableService {
  constructor(private http: HttpClient) {}

  public getPeriodicTable() {
    return this.http
      .get("../assets/periodicTable.json")
      .catch((error: any) => Observable.throw(error));
  }
}
