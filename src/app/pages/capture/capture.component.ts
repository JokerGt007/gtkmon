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

  constructor(private pokeService: PokeCreateService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.sortearPokemon();
  }

  sortearPokemon() {
    this.pokeService.getPokemons().subscribe(pokemons => {
      if (pokemons.length > 0) {
        const randomIndex = Math.floor(Math.random() * pokemons.length);
        this.pokemonSorteado = pokemons[randomIndex];
        this.capturaRealizada = false;
      }
    });
  }

  tentarCaptura() {
    // Verifica se há um Pokémon sorteado. Se não houver, a função retorna imediatamente e não faz nada.
    if (!this.pokemonSorteado) return;

    // Gera um número aleatório entre 0 e 100 para simular a chance de captura.
    const chance = Math.random() * 100;

    // Compara o número gerado com a chance de captura do Pokémon sorteado.
    if (chance <= this.pokemonSorteado.captureChance) {
        // Se o número gerado for menor ou igual à chance de captura, o Pokémon é capturado.
        // Exibe um alerta informando que o Pokémon foi capturado.
        this.alertService.show('Sucesso', `Você capturou ${this.pokemonSorteado.name}!`, 3000);

        // Marca que a captura foi realizada, impedindo novas tentativas para este Pokémon.
        this.capturaRealizada = true;
    } else {
        // Se o número gerado for maior que a chance de captura, o Pokémon escapa.
        // Exibe um alerta informando que o Pokémon fugiu.
        this.alertService.show('Falha', `${this.pokemonSorteado.name} escapou!`, 3000);
    }
  }
}
