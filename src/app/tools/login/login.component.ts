import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  state = LoginCompState.LOGIN;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onForgotPasswordClick() {
    this.state = LoginCompState.FORGOT_PASSWORD;
  }

  onCreateAccountClick() {
    this.state = LoginCompState.CREATE_ACCOUNT;
  }

  onLoginClick() {
    this.state = LoginCompState.LOGIN;
  }

  isLoginState() {
    return this.state === LoginCompState.LOGIN;
  }

  isRegisterState() {
    return this.state === LoginCompState.CREATE_ACCOUNT;
  }

  isForgotPasswordState() {
    return this.state === LoginCompState.FORGOT_PASSWORD;
  }

  loginGoogle(): void {
    this.authService.login();
  }

  getStateText(){
    switch(this.state){
      case LoginCompState.LOGIN:
        return "Login";
      case LoginCompState.CREATE_ACCOUNT:
        return "Register";
      case LoginCompState.FORGOT_PASSWORD:
        return "Forgot Password";''
    }
  }
}

export enum LoginCompState {
  LOGIN,
  CREATE_ACCOUNT,
  FORGOT_PASSWORD
}