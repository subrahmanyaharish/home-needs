import { Component, OnInit, RootRenderer } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  passwordError = false;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.passwordError = false;
    this.isLoading = false;
  }

  onSubmit(register: NgForm) {
    this.error = null;
    if (!register.valid) {return; }
    if (register.value.password !== register.value.confirmPassword) {
      this.passwordError = true;
      setTimeout(() => {
        this.passwordError = false;
      }, 5000);
      return;
    }
    this.isLoading = true;
    const email = register.value.email;
    const password = register.value.password;

    this.authService.signup(email, password).subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['/logIn']);
      },
      errorMsg => {
         console.log(errorMsg);
         this.error = errorMsg;
         this.isLoading = false;
         }
    );

    register.form.reset();
  }

}
