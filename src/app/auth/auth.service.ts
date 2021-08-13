import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  authStateChangedSubject = new Subject()
  authStateChanged$: Observable<any> = this.authStateChangedSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
  ) {
    this.afAuth.onAuthStateChanged(user => {
      this.authStateChangedSubject.next(user)
    })

  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    await this.afAuth.signInWithPopup(provider);
  }


  async signOut() {
    await this.afAuth.signOut();
  }

  async annonymus() {
    const user = await this.afAuth.signInAnonymously();

  }
}
