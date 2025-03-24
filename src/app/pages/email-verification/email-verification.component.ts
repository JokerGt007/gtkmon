import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit, OnDestroy {

  auth = new FirebaseTSAuth();
  intervalId: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.auth.isSignedIn() && !this.auth.getAuth().currentUser?.emailVerified) {
      this.auth.sendVerificaitonEmail();
      
      // Verifica a cada 5 segundos se o e-mail foi verificado
      this.intervalId = setInterval(() => {
        this.auth.getAuth().currentUser?.reload().then(() => {
          if (this.auth.getAuth().currentUser?.emailVerified) {
            clearInterval(this.intervalId); // Para a verificação
            location.reload(); // Recarrega a página automaticamente
          }
        });
      }, 5000);
    } else {
      this.router.navigate([""]);
    }
  }

  onResendClick() {
    this.auth.sendVerificaitonEmail();
  }

  ngOnDestroy(): void {
    // Limpa o intervalo ao sair do componente para evitar chamadas desnecessárias
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
