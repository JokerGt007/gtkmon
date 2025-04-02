import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.css']
})
export class ListUserComponent implements OnInit {
  users: (User & { showPokemons?: boolean; pokemons?: any[] })[] = [];

  constructor(private userService: UserService, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users.map(user => ({
        ...user,
        newRole: user.isAdmin ? 'admin' : 'hunter',
        showPokemons: false, // Inicialmente oculto
        pokemons: [] // Lista de Pokémon capturados
      }));
    });
  }

  updateUserRole(userId: string, newRole: string): void {
    const isAdmin = newRole === 'admin';
    const isHunter = newRole === 'hunter';

    this.userService.updateUserRole(userId, isAdmin, isHunter)
      .then(() => console.log('Role atualizado!'))
      .catch((err) => console.error('Erro ao atualizar role:', err));
  }

  toggleShowPokemons(user: any): void {
    user.showPokemons = !user.showPokemons; // Alterna exibição

    if (user.showPokemons && user.pokemons.length === 0) {
      this.firestore.collection(`Users/${user.id}/bag`).valueChanges().subscribe((pokemons: any[]) => {
        user.pokemons = pokemons;
      });
    }
  }
}
