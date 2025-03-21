import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from "firebase/app";
import "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  async login(): Promise<void>{
    await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
