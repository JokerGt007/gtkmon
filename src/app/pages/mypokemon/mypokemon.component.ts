import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-mypokemon',
  templateUrl: './mypokemon.component.html',
  styleUrls: ['./mypokemon.component.css']
})
export class MyPokemonComponent implements OnInit {
  auth = new FirebaseTSAuth();
  userId: string | null = null;
  myPokemons: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.userId = this.auth.getAuth().currentUser?.uid;
    if (this.userId) {
      this.loadMyPokemons();
    } else {
      console.warn('Usuário não autenticado.');
    }
  }

  loadMyPokemons() {
    if (!this.userId) return;

    this.firestore.collection(`Users/${this.userId}/bag`).snapshotChanges().subscribe({
      next: (snapshot) => {
        this.myPokemons = snapshot.map(doc => ({
          id: doc.payload.doc.id,
          ...doc.payload.doc.data() as any
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar Pokémon do usuário:', err);
      }
    });
  }

  async deletePokemon(pokemonId: string) {
    if (!this.userId || !pokemonId) return;

    try {
      await this.firestore.collection(`Users/${this.userId}/bag`).doc(pokemonId).delete();
      console.log(`Pokémon removido da bag.`);
    } catch (error) {
      console.error('Erro ao remover Pokémon:', error);
    }
  }

  async strengthenPokemon(pokemon: any) {
    if (!this.userId || !pokemon.id) return;

    try {
      await this.firestore.collection(`Users/${this.userId}/bag`).doc(pokemon.id).update({
        power: pokemon.power + 1
      });
      console.log(`Força de ${pokemon.name} aumentada para ${pokemon.power + 1}!`);
    } catch (error) {
      console.error('Erro ao fortalecer Pokémon:', error);
    }
  }
}
