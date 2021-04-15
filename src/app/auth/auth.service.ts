import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  userSubject = new Subject()
  user$: Observable<any> = this.userSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
  ) {
    this.afAuth.onAuthStateChanged(user => {
      console.log('onAuthStateChanged', user)
      this.userSubject.next(user)
    })

  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    await this.afAuth.signInWithPopup(provider);
  }


  async signOut() {
    await this.afAuth.signOut();
  }

  async annonymus() {
    const user = await this.afAuth.signInAnonymously();

  }
}
