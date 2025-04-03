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
      this.auth.listenToSignInStateChanges((user) => {
        if (user) {     
         this.firestore.getDocument( {
            path: ["Users", user.uid],
            onComplete: (result) => {
              if (!result.exists) {
                this.router.navigate(['/']);
                resolve(false);
                return;
              }
              const userData = result.data();
              if (userData?.isAdmin === true || userData?.isAdmin === "true") {
                resolve(true);
              } else {
                this.router.navigate(['/']);
                resolve(false);
              }
            },
            onFail: (err) => {
              this.router.navigate(['/']);
              resolve(false);
            }
          });
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
