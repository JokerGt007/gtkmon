import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  state = LoginCompState.LOGIN;
  firebasetsAuth: FirebaseTSAuth;
  constructor(private authService: AuthService, private alertService: AlertService) { 
    this.firebasetsAuth = new FirebaseTSAuth();
  }
  
  ngOnInit(): void {
  }

  onResetClick(resetEmail: HTMLInputElement){
    let email = resetEmail.value;
    if(this.isNotEmpty(email)) {
      this.firebasetsAuth.sendPasswordResetEmail(
        {
          email: email,
          onComplete: (err) => {
            this.alertService.show(`Email De Recuperar A Senha Enviado Ao ${email}`, 'Ok', 3000);
          }
        }
      );
    }
  }

  onLogin(
    loginEmail: HTMLInputElement,
    loginPassword: HTMLInputElement
  ){
    let email = loginEmail.value;
    let password = loginPassword.value;

    if(this.isNotEmpty(email) && this.isNotEmpty(password)){
      this.firebasetsAuth.signInWith(
        {
          email: email,
          password: password,
          onComplete: (uc) => {
            this.alertService.show('Logado Com Sucesso', 'Ok', 3000);
          },
          onFail: (err) => {
            this.alertService.show('Falha Ao Logar', 'Tentar Novamente', 3000);
          }
        }
      );
    }
  }

  onRegisterClick(
    registerEmail:HTMLInputElement,
    registerPassword: HTMLInputElement,
    registerConfirmPassword: HTMLInputElement
  ){
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmpassword = registerConfirmPassword.value;

    if(
      this.isNotEmpty(email) &&
      this.isNotEmpty(password) &&
      this.isNotEmpty(confirmpassword) &&
      this.isAMatch(password, confirmpassword)
    ){
      this.firebasetsAuth.createAccountWith(
        {
          email: email,
          password: password,
          onComplete: (uc) => {
            this.alertService.show('Conta Criada Com Sucesso', 'OK', 3000);
            registerEmail.value = "";
            registerPassword.value = "";
            registerConfirmPassword.value = "";
          },
          onFail: (err) => {
            this.alertService.show('Falha Em Criar A Conta', 'Tentar Novamente', 3000);
          }
        }
      );
    }  
  } 

  isNotEmpty(text: string){
    return text != null && text.length > 0;
  }

  isAMatch(text: string, comparedWith: string){
    return text == comparedWith;
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