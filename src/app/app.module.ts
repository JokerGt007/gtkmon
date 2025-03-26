import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirebaseTSApp } from 'firebasets/firebasetsapp/firebaseTSApp';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './tools/login/login.component';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { ProfileComponent } from './tools/profile/profile.component';
import { CaptureComponent } from './pages/capture/capture.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { ListuserComponent } from './pages/listuser/listuser.component';
import { FormsModule } from '@angular/forms';  // Importando o FormsModule
import { HttpClientModule } from '@angular/common/http';  // Importando HttpClientModule


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    EmailVerificationComponent,
    ProfileComponent,
    CaptureComponent,
    ListuserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    FirebaseTSAuth
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    FirebaseTSApp.init(environment.firebaseConfig);
  }
}
