import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
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
  types: string[] = [];  // Array para armazenar os tipos de Pokémon

  constructor(private alertService: AlertService) { 
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
    // Carregar os tipos de Pokémon do Firestore
    this.loadPokemonTypes();
  }

  loadPokemonTypes() {
    this.firestore.getCollection({
      path: ["Types"],  // Caminho correto da coleção no Firestore
      where: [],  // Array vazio para não filtrar nada
      onComplete: (result) => {
        if (result && result.docs) {
          // Extrair o campo 'name' de cada documento e armazenar no array 'types'
          this.types = result.docs.map((doc) => doc.data().name);  // Correção aqui
        }
      },
      onFail: (error) => {
        console.error('Erro ao carregar tipos de Pokémon', error);
      }
    });
  }

  onContinueClick(
    usernameInput: HTMLInputElement,
    typeInput: HTMLSelectElement,  // Alterado para select
    pokeInput: HTMLInputElement,
    bioInput: HTMLTextAreaElement
  ) {
    let username = usernameInput.value;
    let favtype = typeInput.value;  // Alterado para favtype
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
          favtype: favtype,  // Usando favtype agora
          favpoke: poke,
          biograph: bio,
          isAdmin: isAdmin,
          isHunter: isHunter
        },
        onComplete: (docId) => {
          this.alertService.show('Perfil Criado', '', 3000);
          // Limpar os campos após criação
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
