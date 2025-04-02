import { Component, OnInit } from '@angular/core';
import { PokeCreateService, Pokemon } from 'src/app/services/pokecreate.service';
import { AlertService } from 'src/app/services/alert.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService, User } from 'src/app/services/user.service';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.css']
})
export class CaptureComponent implements OnInit {
  pokemonSorteado: Pokemon | null = null;
  capturaRealizada = false;
  capturando = false;
  capturado = false;
  exibindoGif = false;
  usuarioLogado: User | null = null;
  auth = new FirebaseTSAuth();

  constructor(
    private pokeService: PokeCreateService,
    private alertService: AlertService,
    private firestore: AngularFirestore,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const savedPokemon = localStorage.getItem('pokemonSorteado');
    if (savedPokemon) {
      this.pokemonSorteado = JSON.parse(savedPokemon);
    } else {
      this.sortearPokemon();
    }

    this.carregarUsuarioLogado();
  }

  carregarUsuarioLogado() {
    const userId = this.auth.getAuth().currentUser?.uid;
    if (userId) {
      this.userService.getUser(userId).subscribe(user => {
        this.usuarioLogado = user || null;
      });
    } else {
      console.warn('Nenhum usuário logado encontrado.');
    }
  }

  sortearPokemon() {
    this.exibindoGif = true;
    
    setTimeout(() => {
      this.pokeService.getPokemons().subscribe(pokemons => {
        if (pokemons.length > 0) {
          const randomIndex = Math.floor(Math.random() * pokemons.length);
          this.pokemonSorteado = pokemons[randomIndex];
          localStorage.setItem('pokemonSorteado', JSON.stringify(this.pokemonSorteado));
          this.capturaRealizada = false;
          this.capturado = false;
        }
        this.exibindoGif = false;
      });
    }, 1000);
  }

  async tentarCaptura() {
    if (!this.pokemonSorteado || this.capturando || !this.usuarioLogado) return;

    this.capturando = true;
    this.playSound('assets/music.mp3');

    setTimeout(async () => {
      const chance = Math.random() * 100;
      if (chance <= this.pokemonSorteado!.captureChance) {
        this.capturado = true;
        this.alertService.show('Sucesso', `Você capturou ${this.pokemonSorteado!.name}!`, 3000);
        this.capturando = false;

        await this.salvarPokemonNoFirestore(this.pokemonSorteado!);

        setTimeout(() => {
          this.sortearPokemon();
          this.capturado = false;
          this.capturaRealizada = false;
        }, 2000);
      } else {
        this.alertService.show('Falha', `${this.pokemonSorteado!.name} escapou!`, 3000);
        setTimeout(() => {
          this.sortearPokemon();
          this.capturando = false;
        }, 1500);
      }
    }, 2000);
  }

  async salvarPokemonNoFirestore(pokemon: Pokemon) {
    if (!this.usuarioLogado || !this.auth.getAuth().currentUser?.uid) {
      console.warn('Usuário não encontrado ou não autenticado.');
      return;
    }
  
    const userId = this.auth.getAuth().currentUser.uid;
    const bagRef = this.firestore.collection(`Users/${userId}/bag`);
  
    // Gerar força aleatória entre 1 e 1000
    const power = Math.floor(Math.random() * 1000) + 1;
  
    try {
      await bagRef.add({
        name: pokemon.name,
        imageLink: pokemon.imageLink,
        captureChance: pokemon.captureChance,
        power: power // Adiciona a força ao Pokémon capturado
      });
      console.log(`Pokémon salvo com sucesso! Força: ${power}`);
    } catch (error) {
      console.error('Erro ao salvar Pokémon:', error);
    }
  }

  playSound(audioSrc: string) {
    const audio = new Audio(audioSrc);
    audio.volume = 0.8;
    audio.currentTime = 1;
    audio.play();

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 5000);
  }
}
