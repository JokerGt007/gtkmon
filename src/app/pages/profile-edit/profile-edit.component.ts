import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from 'src/app/services/alert.service';
import { PokemonService } from 'src/app/services/pokemon.service';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

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
    isAdmin: false,
    isHunter: false
  };

  types: string[] = [];
  pokeSearchText: string = '';
  pokeOptions: string[] = [];
  pokemonImage: string = '';  // Variável para armazenar a URL da imagem
  uid: string | null = null;

  firestore = new FirebaseTSFirestore();

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private alertService: AlertService,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.loadUserData();
        this.loadPokemonTypes();
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
        this.loadPokemonImage(user.favpoke);  // Carregar a imagem do Pokémon favorito ao carregar os dados
      }
    });
  }

  loadPokemonTypes() {
    this.firestore.getCollection({
      path: ["Types"],
      where: [],
      onComplete: result => {
        this.types = result.docs.map(doc => doc.data().name);
      },
      onFail: err => console.error("Erro ao carregar tipos:", err)
    });
  }

  onPokeSearchChange(searchText: string) {
    if (searchText.length < 1) {
      this.pokeOptions = [];
      return;
    }
    this.pokemonService.searchPokemon(searchText).subscribe({
      next: (allResults) => {
        this.pokeOptions = allResults.map(pokemon => pokemon.name);
      },
      error: (err) => {
        console.error('Erro ao buscar Pokémons', err);
      }
    });
  }

  loadPokemonImage(pokemonName: string) {
    if (pokemonName) {
      this.pokemonService.getPokemonImage(pokemonName).subscribe(imageUrl => {
        this.pokemonImage = imageUrl;  // Armazena a URL da imagem para exibição
      });
    }
  }

  save(): void {
    if (!this.uid) return;

    const { publicName, favpoke, favtype, biograph } = this.userData;

    // Atualizar o perfil no Firebase
    this.userService.updateUserProfile(this.uid, { publicName, favpoke, favtype, biograph })
      .then(() => this.alertService.show('Perfil atualizado!', '', 3000))
      .catch(err => this.alertService.show('Erro ao atualizar perfil', '', 3000));
  }
}
