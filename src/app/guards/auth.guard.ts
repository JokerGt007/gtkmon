import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  auth = new FirebaseTSAuth();
  
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.auth.listenToSignInStateChanges((user) => {
        if (user) {
          // Permite o acesso à página de verificação de e-mail, se o e-mail ainda não estiver verificado
          if (state.url === '/emailVerification') {
            if (!user.emailVerified) {
              resolve(true);  // Permite o acesso à página de verificação
            } else {
              // Se o e-mail já foi verificado, redireciona para a página principal
              this.router.navigate(['/']);
              resolve(false);
            }
          } else if (user.emailVerified) {
            // Usuário logado e e-mail verificado pode acessar outras rotas
            resolve(true);
          } else {
            // Se o usuário não tiver e-mail verificado, redireciona para a página de verificação
            this.router.navigate(['/emailVerification']);
            resolve(false);
          }
        } else {
          // Se o usuário não estiver logado, redireciona para a página de login
          if (state.url !== '/emailVerification') {
            this.router.navigate(['/login']);
          }
          resolve(false);
        }
      });
    });
  }
}