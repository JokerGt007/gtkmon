import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(private http: HttpClient) {}

  // Função para pegar os Pokémons com base no nome parcial e gerenciar paginação
  searchPokemon(query: string, offset: number = 0, allResults: any[] = []): Observable<any> {
    return new Observable(observer => {
      this.http.get(`${this.apiUrl}?limit=50&offset=${offset}`).subscribe({
        next: (response: any) => {
          // Filtra os resultados com base na pesquisa
          const filteredResults = response.results.filter(pokemon =>
            pokemon.name.toLowerCase().startsWith(query.toLowerCase())
          );

          // Adiciona os resultados filtrados ao array acumulado
          allResults = allResults.concat(filteredResults);

          // Verifica se há uma próxima página
          if (response.next) {
            const nextOffset = new URL(response.next).searchParams.get('offset');
            if (nextOffset) {
              // Chama novamente a função para buscar a próxima página
              this.searchPokemon(query, parseInt(nextOffset), allResults).subscribe(observer);
            }
          } else {
            // Se não houver mais páginas, emite os resultados acumulados
            observer.next(allResults);
            observer.complete();
          }
        },
        error: err => observer.error(err),
      });
    });
  }
}
