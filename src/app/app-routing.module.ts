import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './tools/login/login.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { CaptureComponent } from './pages/capture/capture.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "emailVerification", component: EmailVerificationComponent},
  {path: "capture", component: CaptureComponent},
  {path: "**", component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
