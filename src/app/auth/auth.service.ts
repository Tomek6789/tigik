import { inject, Injectable } from "@angular/core";
import { Auth, signInWithPopup,  signInAnonymously, GoogleAuthProvider, signOut, signInWithCustomToken,  } from "@angular/fire/auth";
import { Observable, Subject } from "rxjs";
import { User } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  authStateChangedSubject = new Subject<string>()
  authStateChanged$: Observable<string> = this.authStateChangedSubject.asObservable();

  private auth: Auth = inject(Auth);

  constructor() {
    this.auth.onAuthStateChanged(user => {
      console.log(user)
      this.authStateChangedSubject.next(user?.uid)
    })
  }

  async googleSignIn() {
    const provider = new GoogleAuthProvider();

    try {
      return await signInWithPopup(this.auth, provider);
      
    } catch (error) {
      // omit error when popup is close by user
    }
  }


  async signOut() {
    return await signOut(this.auth);
  }

  async anonymous() {
    return await signInAnonymously(this.auth);
  }
}
