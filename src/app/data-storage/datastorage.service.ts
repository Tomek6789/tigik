import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class DatastorageService {
  constructor(private http: HttpClient) {}

  saveScore() {
    return this.http.post("https://tigik-8d88c.firebaseio.com/users.json", {
      user: "tomek",
      email: "tomek@gsf.sdf",
      bestScore: 1000
    });
  }

  getScore() {
    return this.http.get(
      "https://tigik-8d88c.firebaseio.com/users/tester.json"
    );
  }
}
