import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './attendance-marker/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private authSer: AuthService) {}

  ngOnInit() {
    // this.authSer.autoLogin();
    this.userSub = this.authSer.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onLogOut() {
    this.authSer.logout();
  }
}
