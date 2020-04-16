import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user';
import { Router } from '@angular/router';


export interface AuthResponseData {
  idToken:	string;
  email:	string;
  refreshToken:	string;
  expiresIn:	string;
  localId:	string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  userEmail: string = null;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCaglip2fbdKaX5MYmpIQpMef7OG-aFR3g',
    {
      // tslint:disable-next-line: object-literal-shorthand
      email: email,
      // tslint:disable-next-line: object-literal-shorthand
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.errorHandler), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  login(email: string, password: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCaglip2fbdKaX5MYmpIQpMef7OG-aFR3g',
    {
      // tslint:disable-next-line: object-literal-shorthand
      email: email,
      // tslint:disable-next-line: object-literal-shorthand
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.errorHandler), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  private handleAuthentication(email: string, localId: string, tocken: string, expiresIn: number) {
      const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
      const user = new User(email, localId, tocken, expirationDate);
      this.user.next(user);
     // localStorage.setItem('userData', JSON.stringify(user));
  }

  // autoLogin() {
  //   const userData: {email: string,
  //                     id: string,
  //                     _token: string,
  //                     _tokenExpirationDate: string} = JSON.parse(localStorage.getItem('userData'));
  //   if (!userData) {
  //     return;
  //   }
  //   const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate) );
  //   if (loadedUser.token) {
  //     this.user.next(loadedUser);
  //   }
  // }

  logout() {
    this.user.next(null);
    this.router.navigate(['/logIn']);
  }

  private errorHandler(errorRes: HttpErrorResponse) {
    let errorMessage = 'An Unknown error occured';
    if (!errorRes.error || !errorRes.error.error) {
        return throwError(errorMessage);
      }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS': {
        errorMessage = 'The email address is already in use by another account.';
        break;
       }
      case 'EMAIL_NOT_FOUND': {
        errorMessage = 'Email not found';
        break;
      }
      case 'INVALID_PASSWORD': {
        errorMessage = 'The password is invalid';
        break;
      }
      case 'USER_DISABLED': {
        errorMessage = 'The user account has been disabled by an administrator';
        break;
      }
      }
    return throwError(errorMessage);
  }

}
















//   <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/7.14.0/firebase-analytics.js"></script>

// <script>
//   // Your web app's Firebase configuration
//   var firebaseConfig = {
//     apiKey: "AIzaSyCaglip2fbdKaX5MYmpIQpMef7OG-aFR3g",
//     authDomain: "home-needs-e7a96.firebaseapp.com",
//     databaseURL: "https://home-needs-e7a96.firebaseio.com",
//     projectId: "home-needs-e7a96",
//     storageBucket: "home-needs-e7a96.appspot.com",
//     messagingSenderId: "55015620595",
//     appId: "1:55015620595:web:836fc8d90b8c7f59381c86",
//     measurementId: "G-4NETFJH7LD"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
// </script>
