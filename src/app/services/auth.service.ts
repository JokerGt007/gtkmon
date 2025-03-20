import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  async login(): Promise<void>{
    await this.afAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider());
  }
}
