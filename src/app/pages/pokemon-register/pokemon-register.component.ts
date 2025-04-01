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
    id: null,  // Adicionado para armazenar o ID numérico
    name: '',
    imageLink: '',
    captureChance: null
  };

  captureChanceError = false;
  loadingImage = false;
  notFound = false;

  constructor(private http: HttpClient, private alertService: AlertService) { }

  ngOnInit(): void {
    // Inicializa qualquer lógica necessária
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

  async save() {
    if (!this.captureChanceError && this.pokemonData.name && this.pokemonData.captureChance !== null) {
      const lastId = await this.getLastPokemonId();
      this.pokemonData.id = lastId + 1;  // Define um ID numérico crescente

      const pokemonToSave = { ...this.pokemonData };

      this.firestore.create({
        path: ["Pokemons", this.pokemonData.id.toString()], // Usa o ID numérico como chave do documento
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
      id: null,
      name: '',
      imageLink: '',
      captureChance: null
    };
    this.captureChanceError = false;
    this.notFound = false;
  }

  async getLastPokemonId(): Promise<number> {
    return new Promise((resolve) => {
      this.firestore.getCollection({
        path: ["Pokemons"],
        where: [],
        onComplete: (result) => {
          if (result.docs.length > 0) {
            // Encontra o maior ID manualmente
            const lastId = result.docs
              .map(doc => doc.data() as { id: number })
              .reduce((max, p) => (p.id > max ? p.id : max), 0);
  
            resolve(lastId);
          } else {
            resolve(0); // Se não houver Pokémons, começamos do 0
          }
        },
        onFail: (err) => {
          console.error("Erro ao obter último ID:", err);
          resolve(0);
        }
      });
    });
  }  
}
