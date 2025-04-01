import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Pokemon {
  id?: number; // ID numérico crescente
  name: string;
  imageLink: string;
  captureChance: number;
}

@Injectable({
  providedIn: 'root'
})
export class PokeCreateService {
  constructor(private firestore: AngularFirestore) {}

  // Adicionar um Pokémon ao Firestore com ID numérico crescente
  async addPokemon(pokemon: Pokemon): Promise<void> {
    const lastId = await this.getLastPokemonId();
    const newId = lastId + 1;

    return this.firestore.collection('Pokemons').doc(newId.toString()).set({ ...pokemon, id: newId });
  }

  // Obter todos os Pokémons cadastrados
  getPokemons(): Observable<Pokemon[]> {
    return this.firestore.collection<Pokemon>('Pokemons').valueChanges();
  }

  // Buscar o maior ID atualmente cadastrado
  private async getLastPokemonId(): Promise<number> {
    const snapshot = await this.firestore.collection<Pokemon>('Pokemons', ref => ref.orderBy('id', 'desc').limit(1)).get().toPromise();
    
    if (snapshot && !snapshot.empty) {
      const lastPokemon = snapshot.docs[0].data() as Pokemon; // Cast explícito para o tipo Pokemon
      return lastPokemon.id ?? 0; // Retorna o ID ou 0 caso não exista
    }
    
    return 0; // Se não houver Pokémons cadastrados, começamos do 0
  }
}
