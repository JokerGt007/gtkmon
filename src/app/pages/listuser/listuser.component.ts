// src/app/components/listuser/listuser.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.css']
})
export class ListUserComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Buscar usuários do Firestore
    this.userService.getUsers().subscribe((users) => {
      this.users = users.map(user => ({
        ...user,
        newRole: user.isAdmin ? 'admin' : 'hunter' // Define o role baseado em 'isAdmin'
      }));
    });
  }

  // Função para atualizar o role do usuário
  updateUserRole(userId: string, newRole: string): void {
    const isAdmin = newRole === 'admin';
    const isHunter = newRole === 'hunter';

    this.userService.updateUserRole(userId, isAdmin, isHunter)
      .then(() => console.log('Role atualizado!'))
      .catch((err) => console.error('Erro ao atualizar role:', err));
  }
}
