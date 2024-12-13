import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: any | null;

  constructor() { }

  setCurrentUser(user: any): void {
    this.currentUser = user;
  }

  getCurrentUser(): any | null {
    return this.currentUser;
  }

  clearCurrentUser(): void {
    this.currentUser = null;
  }
}
