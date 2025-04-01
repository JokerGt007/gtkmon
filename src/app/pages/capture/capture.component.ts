import { Component, OnInit } from '@angular/core';
import { PokeCreateService, Pokemon } from 'src/app/services/pokecreate.service';
import { AlertService } from 'src/app/services/alert.service';

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

  constructor(private pokeService: PokeCreateService, private alertService: AlertService) {}

  ngOnInit(): void {
    const savedPokemon = localStorage.getItem('pokemonSorteado');
    if (savedPokemon) {
      this.pokemonSorteado = JSON.parse(savedPokemon);
    } else {
      this.sortearPokemon();
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
    }, 1000); // Tempo para exibir o gif `apper.gif`
  }

  tentarCaptura() {
    if (!this.pokemonSorteado || this.capturando) return;

    this.capturando = true;
    this.playSound('assets/music.mp3');

    setTimeout(() => {
      const chance = Math.random() * 100;

      if (chance <= this.pokemonSorteado!.captureChance) {
        this.capturado = true;
        this.alertService.show('Sucesso', `Você capturou ${this.pokemonSorteado!.name}!`, 3000);
        this.capturando = false;
        setTimeout(() => {
          this.sortearPokemon();
          this.capturado = false;
          this.capturaRealizada = false;
          // this.capturando = false;
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

  playSound(audioSrc: string) {
    const audio = new Audio(audioSrc);
    audio.play();
  }
}
