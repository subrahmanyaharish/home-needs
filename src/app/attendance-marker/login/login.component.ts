import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  passwordError = false;
  isLoading = false;
  error: string = null;
  email: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(login: NgForm) {
    this.error = null;
    if (!login.valid) {return; }
    this.isLoading = true;
    const email = login.value.email;
    const password = login.value.password;

    this.authService.login(email, password).subscribe(
      resData => {
        this.isLoading = false;
        this.email = resData.email;
        this.authService.userEmail = this.email;
        this.router.navigate(['/attendace']);
      },
      errorMsg => {
         this.error = errorMsg;
         this.isLoading = false;
         }
    );

    login.form.reset();
  }


}
