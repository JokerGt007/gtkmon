import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from "firebase/app";
import "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  async login(): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      if (userCredential.user) {
        localStorage.setItem('userId', userCredential.user.uid); // Salva o ID do usuário
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
    localStorage.removeItem('userId'); // Remove o ID do usuário ao deslogar
  }
}
