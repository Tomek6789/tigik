import { inject, Injectable } from "@angular/core";
import { Auth, signInWithPopup,  signInAnonymously, GoogleAuthProvider, signOut } from "@angular/fire/auth";
import { Observable, Subject } from "rxjs";
import { User } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  authStateChangedSubject = new Subject<User>()
  aauthStateChanged$: Observable<User> = this.authStateChangedSubject.asObservable();

  private auth: Auth = inject(Auth);

  constructor() {
   
    this.auth.onAuthStateChanged(user => {
      console.log('INIT',user)
      this.authStateChangedSubject.next(user)
    })

  }

  getCurrentuser() {
    return this.auth.currentUser
  }

  async googleSignin() {
    const provider = new GoogleAuthProvider();
    
    try {
      console.log('auth service - sgininwith pop')
      return await signInWithPopup(this.auth, provider);
      
    } catch (error) {
      // omit error when popup is close by user
    }
  }


  async signOut() {
    console.log('sigout')
    return await signOut(this.auth);
  }

  async annonymus() {
    return await signInAnonymously(this.auth);
  }
}
