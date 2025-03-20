import { Component } from '@angular/core';
import { LoginCompState } from './tools/login/login.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gtkmon';
  isDarkMode = false;
  state: any;
  constructor(private router: Router) {

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
}
