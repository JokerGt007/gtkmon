import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      const user = this.auth.getAuth().currentUser;
      
      if (!user) {
        console.log("Usuário não autenticado. Redirecionando para login.");
        this.router.navigate(['/login']);
        resolve(false);
        return;
      }

      this.firestore.getDocument({
        path: ["Users", user.uid],
        onComplete: (result) => {
          const userData = result.data();
          console.log("Dados do usuário:", userData);

          if (userData && (userData.isAdmin === true || userData.isAdmin === "true")) {
            console.log("Usuário autorizado como admin.");
            resolve(true);
          } else {
            console.log("Usuário não autorizado. Redirecionando...");
            this.router.navigate(['/']);
            resolve(false);
          }
        },
        onFail: (error) => {
          console.error("Erro ao buscar usuário:", error);
          this.router.navigate(['/']);
          resolve(false);
        }
      });
    });
  }
}
