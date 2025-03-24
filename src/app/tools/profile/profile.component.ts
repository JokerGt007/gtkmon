import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore'
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() show: boolean;

  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;

  constructor(private alertService: AlertService) { 
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
  }

  onContinueClick(
    usernameInput: HTMLInputElement,
    typeInput: HTMLInputElement,
    pokeInput: HTMLInputElement,
    bioInput: HTMLTextAreaElement
  ) {
    let username = usernameInput.value;
    let type = typeInput.value;
    let poke = pokeInput.value;
    let bio = bioInput.value;
    let isAdmin = false;
    let isHunter = true;

    if (isAdmin) {
      isHunter = false;
    } 

    if (isHunter) {
      isAdmin = false;
    }


    this.firestore.create(
      {
        path: ["Users", this.auth.getAuth().currentUser.uid],
        data: {
          publicName: username,
          types: type,
          favpoke: poke,
          biograph: bio,
          isAdmin: isAdmin,
          isHunter: isHunter
        },
        onComplete: (docId) => {
          this.alertService.show('Profile Criado', '', 3000);
          usernameInput.value = "";
          typeInput.value = "";
          pokeInput.value = "";
          bioInput.value = "";
        },
        onFail: (err) => {
          this.alertService.show('Erro ao criar o perfil', '', 3000);
        }
      }
    );
  }
}
