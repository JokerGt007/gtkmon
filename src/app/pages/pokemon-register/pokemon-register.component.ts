import { Component, OnInit } from '@angular/core';
import { PokeCreateService, Pokemon } from 'src/app/services/pokecreate.service';
import { AlertService } from 'src/app/services/alert.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-register',
  templateUrl: './pokemon-register.component.html',
  styleUrls: ['./pokemon-register.component.css']
})
export class PokemonRegisterComponent implements OnInit {
  pokemonData: Pokemon = {
    name: '',
    imageLink: '',
    captureChance: 0
  };

  captureChanceError = false;
  loadingImage = false; // Para indicar quando está carregando a imagem

  constructor(
    private pokeCreateService: PokeCreateService,
    private alertService: AlertService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  validateCaptureChance() {
    const { captureChance } = this.pokemonData;
    this.captureChanceError = captureChance < 0 || captureChance > 100;
  }

  fetchPokemonImage() {
    const pokemonName = this.pokemonData.name.trim().toLowerCase();
    if (!pokemonName) return;

    this.loadingImage = true; // Exibir indicador de carregamento

    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .subscribe({
        next: (response) => {
          this.pokemonData.imageLink = response.sprites.other['official-artwork'].front_default;
          this.loadingImage = false;
        },
        error: () => {
          this.alertService.show('Erro', 'Pokémon não encontrado.', 3000);
          this.loadingImage = false;
        }
      });
  }

  save() {
    if (this.captureChanceError || !this.pokemonData.name || !this.pokemonData.imageLink) {
      this.alertService.show('Erro', 'Preencha todos os campos corretamente.', 3000);
      return;
    }

    this.pokeCreateService.addPokemon(this.pokemonData)
      .then(() => {
        this.alertService.show('Sucesso', 'Pokémon cadastrado com sucesso!', 3000);
        this.pokemonData = { name: '', imageLink: '', captureChance: 0 };
      })
      .catch(() => {
        this.alertService.show('Erro', 'Falha ao cadastrar Pokémon.', 3000);
      });
  }
}
