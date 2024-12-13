import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };
  currentUser: any;

  constructor(
    private authService: AuthService, 
    private router: Router) {}

  ngOnInit(): void {
  }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  loginSubmitted() {
    const loginData = {
      email: this.Email.value,
      password: this.Password.value
    };
  
    this.authService.login(loginData).subscribe(
      (response) => {
        console.log('Login Successful', response);
        setTimeout(() => {
          this.currentUser = response; // update the currentuser with new user information
          localStorage.setItem('currentUser', JSON.stringify(response));
        });
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }  

  get Email(): FormControl {
    return this.loginForm.get("email") as FormControl;
  }

  get Password(): FormControl {
    return this.loginForm.get("password") as FormControl;
  }
}
