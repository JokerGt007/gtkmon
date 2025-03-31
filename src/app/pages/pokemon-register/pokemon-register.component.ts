import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-pokemon-register',
  templateUrl: './pokemon-register.component.html',
  styleUrls: ['./pokemon-register.component.css']
})
export class PokemonRegisterComponent implements OnInit {

  firestore = new FirebaseTSFirestore();
  pokemonData = {
    name: '',
    imageLink: '',
    captureChance: null
  };

  captureChanceError = false;
  loadingImage = false;
  notFound = false;

  constructor(private http: HttpClient, private alertService: AlertService) { }

  ngOnInit(): void {
    // Inicialize qualquer lógica adicional, se necessário
  }

  validateCaptureChance() {
    const captureChance = this.pokemonData.captureChance;
    this.captureChanceError = captureChance < 0 || captureChance > 100;
  }

  fetchPokemonImage() {
    if (!this.pokemonData.name) {
      return;
    }

    const pokemonName = this.pokemonData.name.toLowerCase();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    this.loadingImage = true;
    this.notFound = false;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.pokemonData.imageLink = response.sprites.other['official-artwork'].front_default;
        this.loadingImage = false;
      },
      () => {
        this.loadingImage = false;
        this.notFound = true;
        this.pokemonData.imageLink = '';
        
      }
    );
  }

  save() {
    if (!this.captureChanceError && this.pokemonData.name && this.pokemonData.captureChance !== null) {
      const pokemonToSave = {
        name: this.pokemonData.name,
        imageLink: this.pokemonData.imageLink,
        captureChance: this.pokemonData.captureChance
      };

      this.firestore.create({
        path: ["Pokemons"],
        data: pokemonToSave,
        onComplete: () => {
          this.alertService.show('Sucesso', 'Pokémon cadastrado com sucesso!', 3000);
          this.resetForm();
        },
        onFail: (err) => {
          console.error("Erro ao cadastrar Pokémon:", err);
          this.alertService.show('Erro', 'Falha ao cadastrar Pokémon.', 3000);
        }
      });
    }
  }

  resetForm() {
    this.pokemonData = {
      name: '',
      imageLink: '',
      captureChance: null
    };
    this.captureChanceError = false;
    this.notFound = false;
  }
}
