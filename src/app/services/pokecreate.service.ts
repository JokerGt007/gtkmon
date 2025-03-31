import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Pokemon {
  id?: string;
  name: string;
  imageLink: string;
  captureChance: number;
}

@Injectable({
  providedIn: 'root'
})
export class PokeCreateService {
  constructor(private firestore: AngularFirestore) {}

  // Adicionar um Pokémon ao Firestore
  addPokemon(pokemon: Pokemon): Promise<void> {
    const id = this.firestore.createId(); // Gera um ID único para o Pokémon
    return this.firestore.collection('Pokemons').doc(id).set({ ...pokemon, id });
  }

  // Obter todos os Pokémons cadastrados
  getPokemons(): Observable<Pokemon[]> {
    return this.firestore.collection<Pokemon>('Pokemons').valueChanges();
  }
}
