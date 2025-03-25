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
        console.log('Estado de autenticação atualizado: ', user);
        if (user) {
          // Se o usuário estiver logado, pode acessar a rota
          resolve(true);
        } else {
          // Se não estiver logado, redireciona para a página de login
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
