import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  userData: User = {
    publicName: '',
    favpoke: '',
    favtype: '',
    biograph: '',
    isAdmin: false, // mesmo que não use, mantém para evitar erros de tipo
    isHunter: false
  };

  uid: string | null = null;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.loadUserData();
      }
    });
  }

  loadUserData(): void {
    if (!this.uid) return;

    this.userService.getUser(this.uid).subscribe(user => {
      if (user) {
        this.userData = {
          publicName: user.publicName || '',
          favpoke: user.favpoke || '',
          favtype: user.favtype || '',
          biograph: user.biograph || '',
          isAdmin: user.isAdmin || false,
          isHunter: user.isHunter || false
        };
      }
    });
  }

  save(): void {
    if (!this.uid) return;

    // só envia os campos editáveis
    const { publicName, favpoke, favtype, biograph } = this.userData;

    this.userService.updateUserProfile(this.uid, { publicName, favpoke, favtype, biograph })
      .then(() => this.alertService.show('Perfil atualizado!', '', 3000))
      .catch(err => this.alertService.show('Erro ao atualizar perfil', '', 3000));
  }
}
