import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();

  constructor(private router: Router) { }

  ngOnInit(): void { }

  onStartClick() {
    this.auth.listenToSignInStateChanges((user) => {
      if (user) {
        // Se o usuário estiver logado, vamos buscar os dados dele
        this.firestore.getDocument({
          path: ["Users", user.uid],
          onComplete: (result) => {
            if (result.exists) {
              const userData = result.data();
              if (userData?.isAdmin === true || userData?.isAdmin === "true") {
                // Se for admin, redireciona para /listuser
                this.router.navigate(['/listuser']);
              } else {
                // Se for usuário normal, redireciona para /capture
                this.router.navigate(['/capture']);
              }
            } else {
              // Se não encontrar o usuário no Firestore, redireciona para o login
              this.router.navigate(['/login']);
            }
          },
          onFail: (err) => {
            // Caso algum erro ocorra ao buscar os dados do usuário, redireciona para o login
            console.error('Erro ao buscar dados do usuário', err);
            this.router.navigate(['/login']);
          }
        });
      } else {
        // Se não estiver logado, redireciona para o login
        this.router.navigate(['/login']);
      }
    });
  }
}
