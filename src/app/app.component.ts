import { Component } from '@angular/core';
import { LoginCompState } from './tools/login/login.component';
import { Router } from '@angular/router';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';


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
  isLoggedIn = false;
  constructor(private router: Router) {
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user => {
              alert("Logged In");

            },
            whenSignedOut: user => {
              alert("Logged Out")
            },
            whenSignedInAndEmailNotVerified: user => {

            },
            whenSignedInAndEmailVerified: user => {

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
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }
  onHomeClick() {
    this.router.navigate(['/']);
  }

  onLogoutClick(){
    this.auth.signOut();
  }

  loggedIn(){
    return this.auth.isSignedIn();
  }
}
