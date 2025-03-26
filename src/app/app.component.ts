import { Component } from '@angular/core';
import { LoginCompState } from './tools/login/login.component';
import { Router } from '@angular/router';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gtkmon';
  isDarkMode = false;
  state: any;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  private static userDocument: UserDocument | null = null;
  isLoggedIn = false;
  constructor(private router: Router) {
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {


            },
            whenSignedOut: user => {
              
            },
            whenSignedInAndEmailNotVerified: user => {
              this.router.navigate(["emailVerification"])
            },
            whenSignedInAndEmailVerified: user => {
              this.getUserProfile();
            },
            whenChanged: user => {
              
            }
          }
        );
      }
    );
  }
  
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('dark-mode', String(this.isDarkMode));
    this.updateTheme();
  }

  updateTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }  

  getUsername() {
    try {
      return AppComponent.userDocument?.publicName;
    } catch (err) {}
  }

  getUserProfile() {
    this.firestore.listenToDocument({
      name: "Getting Document",
      path: ["Users", this.auth.getAuth().currentUser?.uid],
      onUpdate: (result) => {
        AppComponent.userDocument = result.data() as UserDocument;
        this.userHasProfile = result.exists;
  
        if (this.userHasProfile) {
          // Garantir que isAdmin seja tratado como booleano
          const isAdmin = Boolean(AppComponent.userDocument.isAdmin);
          
          if (isAdmin) {
            this.router.navigate(["listuser"]);
          } else {
            this.router.navigate(["capture"]);
          }
        }
      }
    });
  }
  

  onLoginClick() {
    this.router.navigate(['/login']);
  }
  onHomeClick() {
    this.router.navigate(['/']);
  }

  onLogoutClick(){
    this.auth.signOut();
    this.router.navigate(['/']);
  }

  loggedIn(){
    return this.auth.isSignedIn();
  }
}

export interface UserDocument {
  publicName: string;
  types: string;
  favpoke: string;
  biograph: string;
  isAdmin: boolean;
  isHunter: boolean;
}