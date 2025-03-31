import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  pokemons: Pokemon[] = [];
  loading = false;
  nextUrl: string | null = 'https://pokeapi.co/api/v2/pokemon?limit=50';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMore();
  }

  loadMore() {
    if (!this.nextUrl) return;

    this.loading = true;
    this.http.get<any>(this.nextUrl).subscribe(response => {
      const newPokemons = response.results.map((poke: any) => 
        this.http.get(poke.url).toPromise()
      );

      Promise.all(newPokemons).then((pokemonDetails: any[]) => {
        const pokemonData = pokemonDetails.map(poke => ({
          id: poke.id,
          name: poke.name,
          image: poke.sprites.other['official-artwork'].front_default,
          types: poke.types.map((t: any) => t.type.name)
        }));

        this.pokemons = [...this.pokemons, ...pokemonData];
        this.nextUrl = response.next;
        this.loading = false;
      });
    }, error => {
      console.error("Erro ao carregar Pokémon:", error);
      this.loading = false;
    });
  }
}
