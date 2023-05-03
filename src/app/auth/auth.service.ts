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
      console.log('INIT',user)
      this.authStateChangedSubject.next(user)
    })

  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
      return await this.afAuth.signInWithPopup(provider);
      
    } catch (error) {
      // omit error when popup is close by user
    }
  }


  async signOut() {
    return await this.afAuth.signOut();
  }

  async annonymus() {
    return await this.afAuth.signInAnonymously();
  }
}
