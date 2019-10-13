import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
@Injectable()
export class DatastorageService {

  constructor(
    private http: Http,
  ) { }

  saveScore() {
    return this.http.post('https://tigik-8d88c.firebaseio.com/users.json', { user: 'tomek', email: 'tomek@gsf.sdf', bestScore: 1000 })
  }

  getScore() {
    return this.http.get('https://tigik-8d88c.firebaseio.com/users/tester.json')
      .map((data: Response) => {
        return data.json()
      })
  }

}
