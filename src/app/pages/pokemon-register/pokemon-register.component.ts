import { Component } from '@angular/core';
import { PokeCreateService, Pokemon } from 'src/app/services/pokecreate.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-pokemon-register',
  templateUrl: './pokemon-register.component.html',
  styleUrls: ['./pokemon-register.component.css']
})
export class PokemonRegisterComponent {
  pokemonData: Pokemon = {
    name: '',
    imageLink: '',
    captureChance: null
  };

  captureChanceError = false;
  loadingImage = false;
  notFound = false;

  constructor(
    private pokeCreateService: PokeCreateService,
    private alertService: AlertService
  ) {}

  validateCaptureChance() {
    const captureChance = this.pokemonData.captureChance;
    this.captureChanceError = captureChance < 0 || captureChance > 100;
  }

  fetchPokemonImage() {
    if (!this.pokemonData.name) return;

    const pokemonName = this.pokemonData.name.toLowerCase();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    this.loadingImage = true;
    this.notFound = false;

    fetch(apiUrl)
      .then(res => res.json())
      .then(response => {
        this.pokemonData.imageLink = response.sprites.other['official-artwork'].front_default;
        this.loadingImage = false;
      })
      .catch(() => {
        this.loadingImage = false;
        this.notFound = true;
        this.pokemonData.imageLink = '';
      });
  }

  save() {
    if (!this.captureChanceError && this.pokemonData.name && this.pokemonData.captureChance !== null) {
      this.pokeCreateService.addPokemon(this.pokemonData).subscribe(
        response => {
          this.alertService.show('Sucesso', 'Pokémon cadastrado com sucesso!', 3000);
          this.resetForm();
        },
        error => {
          console.error('Erro ao cadastrar Pokémon:', error);
          this.alertService.show('Erro', 'Falha ao cadastrar Pokémon.', 3000);
        }
      );
    }
  }

  resetForm() {
    this.pokemonData = { name: '', imageLink: '', captureChance: null };
    this.captureChanceError = false;
    this.notFound = false;
  }
}
