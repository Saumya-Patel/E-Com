import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  confirmPass: string = 'none';
  constructor(private authService: AuthService, 
    private router: Router) {}

  ngOnInit(): void {
  }

  registerForm = new FormGroup({
    fullName: new FormControl("", [ //array of validator using formControl
      Validators.required, 
      Validators.maxLength(50), 
      Validators.pattern("^[a-zA-Z][a-zA-Z ]*$")
    ]),

    email: new FormControl("", [
      Validators.required,
      Validators.email
    ]),

    phNo: new FormControl("", [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("[0-9]*")
    ]),

    pwd: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern("^(?=.*[!@#$%^&*(),.?\":{}|<>])(?=.*[a-zA-Z])(?=.*[0-9]).*$")
    ]),

    cnfPwd: new FormControl("")
  });

  registerSubmitted() {
    if(this.Pwd.value == this.CnfPwd.value) {
      const registrationData = {
        fullName: this.FullName.value,
        email: this.Email.value,
        phNo: this.Phno.value,
        pwd: this.Pwd.value
      };

      this.authService.register(registrationData)
        .subscribe(
          (response) => {
            console.log('Registration successful', response);
            this.router.navigate(['login']);
          },
          (error) => {
            console.error('Registration failed', error);
          }
        );
      
      this.confirmPass = 'none';  //to hide or remove the display of error msg
    }
    else {
      this.confirmPass = 'inline';//to show or display of error msg
    }
  }

  get FullName(): FormControl {
    return this.registerForm.get("fullName") as FormControl;
  }

  get Email(): FormControl {
    return this.registerForm.get("email") as FormControl;
  }

  get Phno(): FormControl {
    return this.registerForm.get("phNo") as FormControl;
  }

  get Pwd(): FormControl {
    return this.registerForm.get("pwd") as FormControl;
  }

  get CnfPwd(): FormControl {
    return this.registerForm.get("cnfPwd") as FormControl;
  }
}
