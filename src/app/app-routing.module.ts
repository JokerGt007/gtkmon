import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './tools/login/login.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { CaptureComponent } from './pages/capture/capture.component';
import { AuthGuard } from './guards/auth.guard';
import { ListUserComponent } from './pages/listuser/listuser.component';
import { AdminGuard } from './guards/admin.guard';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { PokemonRegisterComponent } from './pages/pokemon-register/pokemon-register.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "emailVerification", component: EmailVerificationComponent, canActivate: [AuthGuard]},
  {path: "capture", component: CaptureComponent, canActivate: [AuthGuard]},
  {path: "profile", component: ProfileEditComponent, canActivate: [AuthGuard]},
  {path: "listuser", component: ListUserComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: "pokeregister", component: PokemonRegisterComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: "**", component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
