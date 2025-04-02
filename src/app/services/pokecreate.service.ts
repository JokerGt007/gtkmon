import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Pokemon {
  id?: number;  // ID numérico crescente
  name: string;
  imageLink: string;
  captureChance: number;
}

@Injectable({
  providedIn: 'root'
})
export class PokeCreateService {

  private apiUrl = 'http://localhost:3000'; // URL da sua API backend

  constructor(private http: HttpClient) {}

  // Adicionar um Pokémon através da API
  addPokemon(pokemon: Pokemon): Observable<any> {
    return this.http.post(`${this.apiUrl}/addPokemon`, pokemon).pipe(
      catchError((error) => {
        console.error('Erro ao adicionar Pokémon:', error);
        throw error;
      })
    );
  }

  // Obter todos os Pokémons através da API
  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.apiUrl}/getPokemons`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar Pokémons:', error);
        throw error; // Lança o erro para ser tratado onde a função for chamada
      })
    );
  }
}
