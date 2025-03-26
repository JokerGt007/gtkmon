import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { AlertService } from 'src/app/services/alert.service';
import { PokemonService } from 'src/app/services/pokemon.service'; // Importe o serviço de Pokémon

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
  pokeSearchText: string = ''; // Texto digitado para pesquisa
  pokeOptions: string[] = [];  // Armazena as opções de Pokémon para sugerir
  selectedPokemon: string = ''; // Valor do Pokémon selecionado

  constructor(private alertService: AlertService, private pokemonService: PokemonService) { 
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
          this.types = result.docs.map((doc) => doc.data().name);  // Correção aqui
        }
      },
      onFail: (error) => {
        console.error('Erro ao carregar tipos de Pokémon', error);
      }
    });
  }

  // Função chamada sempre que o usuário digitar algo no campo de pesquisa
  onPokeSearchChange(searchText: string) {
    this.pokeSearchText = searchText;
    if (searchText.length < 1) {  // Se o texto for muito curto, não faz a busca
      this.pokeOptions = [];
      return;
    }
    this.fetchPokemonNames(searchText);  // Chama a função para fazer a busca
  }

  fetchPokemonNames(query: string) {
    this.pokemonService.searchPokemon(query).subscribe({
      next: (allResults) => {
        this.pokeOptions = allResults.map(pokemon => pokemon.name);
      },
      error: (err) => {
        console.error('Erro ao buscar Pokémons', err);
      }
    });
  }

  onContinueClick(
    usernameInput: HTMLInputElement,
    typeInput: HTMLSelectElement,
    pokeInput: HTMLSelectElement,
    bioInput: HTMLTextAreaElement
  ) {
    let username = usernameInput.value;
    let favtype = typeInput.value;
    let poke = this.selectedPokemon; // Agora usamos o valor selecionado no select
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
          favtype: favtype,
          favpoke: poke, // Aqui é onde o Pokémon selecionado será gravado
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
          this.selectedPokemon = ''; // Limpar o Pokémon selecionado
        },
        onFail: (err) => {
          this.alertService.show('Erro ao criar o perfil', '', 3000);
        }
      }
    );
  }
}
