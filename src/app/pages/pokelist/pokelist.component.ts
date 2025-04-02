import { Component, OnInit } from '@angular/core';
import { PokeCreateService, Pokemon } from 'src/app/services/pokecreate.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-pokelist',
  templateUrl: './pokelist.component.html',
  styleUrls: ['./pokelist.component.css']
})
export class PokelistComponent implements OnInit {
  allPokemons: Pokemon[] = [];
  capturedPokemons: string[] = [];
  auth = new FirebaseTSAuth();
  loading = true;

  constructor(private pokeService: PokeCreateService, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.loadAllPokemons();
    this.loadCapturedPokemons();
  }

  loadAllPokemons() {
    this.pokeService.getPokemons().subscribe({
      next: (pokemons) => {
        this.allPokemons = pokemons;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar Pokémon:', err);
        this.loading = false;
      }
    });
  }

  loadCapturedPokemons() {
    const userId = this.auth.getAuth().currentUser?.uid;
    if (!userId) return;

    this.firestore.collection(`Users/${userId}/bag`).valueChanges().subscribe((captured: any[]) => {
      this.capturedPokemons = captured.map(pokemon => pokemon.name);
    });
  }

  isCaptured(pokemonName: string): boolean {
    return this.capturedPokemons.includes(pokemonName);
  }

  countPokemon(pokemonName: string): number {
    return this.capturedPokemons.filter(name => name === pokemonName).length;
  }
}
