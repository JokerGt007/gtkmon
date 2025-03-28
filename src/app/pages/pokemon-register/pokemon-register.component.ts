import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokemon-register',
  templateUrl: './pokemon-register.component.html',
  styleUrls: ['./pokemon-register.component.css']
})
export class PokemonRegisterComponent implements OnInit {

  pokemonData = {
    name: '',
    imageLink: '',
    captureChance: null
  };

  captureChanceError = false;

  constructor() { }

  ngOnInit(): void {
    // Inicialize qualquer lógica adicional se necessário
  }

  validateCaptureChance() {
    const captureChance = this.pokemonData.captureChance;
    if (captureChance < 0 || captureChance > 100) {
      this.captureChanceError = true;
    } else {
      this.captureChanceError = false;
    }
  }

  save() {
    if (!this.captureChanceError) {
      // Lógica de salvar o Pokémon
      console.log('Pokémon cadastrado com sucesso:', this.pokemonData);
    }
  }
}
