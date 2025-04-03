import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-mypokemon',
  templateUrl: './mypokemon.component.html',
  styleUrls: ['./mypokemon.component.css']
})
export class MyPokemonComponent implements OnInit, OnDestroy {
  auth = new FirebaseTSAuth();
  userId: string | null = null;
  myPokemons: any[] = [];
  cooldownInterval: any;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.userId = this.auth.getAuth().currentUser?.uid;
    if (this.userId) {
      this.loadMyPokemons();
    } else {
      console.warn('Usuário não autenticado.');
    }

    // Atualiza os cooldowns a cada segundo
    this.cooldownInterval = setInterval(() => {
      this.updateCooldowns();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  loadMyPokemons() {
    if (!this.userId) return;

    this.firestore.collection(`Users/${this.userId}/bag`).snapshotChanges().subscribe({
      next: (snapshot) => {
        this.myPokemons = snapshot.map(doc => {
          const data = doc.payload.doc.data() as any;
          return {
            id: doc.payload.doc.id,
            ...data,
            cooldown: this.getCooldownTime(data.lastStrengthen)
          };
        });
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

    const cooldownTime = 5 * 60 * 1000; // 5 minutos em milissegundos
    const now = new Date().getTime();

    if (pokemon.cooldown > 0) {
      console.warn(`Aguarde ${Math.ceil(pokemon.cooldown / 1000)}s para fortalecer novamente.`);
      return;
    }

    try {
      await this.firestore.collection(`Users/${this.userId}/bag`).doc(pokemon.id).update({
        power: pokemon.power + 1,
        lastStrengthen: now
      });
      console.log(`Força de ${pokemon.name} aumentada para ${pokemon.power + 1}!`);
    } catch (error) {
      console.error('Erro ao fortalecer Pokémon:', error);
    }
  }

  getCooldownTime(lastStrengthen?: number): number {
    if (!lastStrengthen) return 0;

    const cooldownTime = 5 * 60 * 1000; // 5 minutos
    const now = new Date().getTime();
    const timeLeft = cooldownTime - (now - lastStrengthen);

    return timeLeft > 0 ? timeLeft : 0;
  }

  updateCooldowns(): void {
    this.myPokemons.forEach(pokemon => {
      pokemon.cooldown = this.getCooldownTime(pokemon.lastStrengthen);
    });
  }
}
