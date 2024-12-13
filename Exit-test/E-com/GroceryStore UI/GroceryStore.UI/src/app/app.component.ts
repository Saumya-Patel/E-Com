import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GroceryStore.UI';
  currentYear?: number;
  isLoggedIn = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private userService: UserService) 
    {
      this.currentYear = new Date().getFullYear();
    }

  ngOnInit() {
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.userService.setCurrentUser(currentUser);
    this.authService.checkLoggedInStatus();
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  get currentUser() {
    return this.userService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.userService.clearCurrentUser();
    this.router.navigate(['']);
  }
}
