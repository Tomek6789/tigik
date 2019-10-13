import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class PeriodicTableService {

  constructor(private http: Http) { }

  public getPeriodicTable() {
    return this.http.get("../assets/periodicTable/periodicTable.json")
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error))
  }

}