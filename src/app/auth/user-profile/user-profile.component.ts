import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "app/auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent  {
  show: boolean
  user: any
  private sub: Subscription = new Subscription()
  constructor(public auth: AuthService) { }

  // ngOnInit() {
  //   this.sub.add(this.auth.authStateChanged$.subscribe((user) => {
  //     this.show = !!user
  //     this.user = user
  //   }))
  // }

  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }
}
