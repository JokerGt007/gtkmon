// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface User {
  id?: string;
  publicName: string;
  favpoke: string;
  favtype: string;
  biograph: string;
  isAdmin: boolean;
  isHunter: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  // Buscar todos os usuários
  getUsers(): Observable<User[]> {
    return this.firestore.collection<User>('Users').valueChanges({ idField: 'id' });
  }

  // Atualizar o status de admin e hunter de um usuário
  updateUserRole(id: string, isAdmin: boolean, isHunter: boolean): Promise<void> {
    return this.firestore.collection('Users').doc(id).update({
      isAdmin: isAdmin,
      isHunter: isHunter
    });
  }
}
