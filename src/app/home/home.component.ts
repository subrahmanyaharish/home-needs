import { Component, OnInit } from '@angular/core';
import { AuthService } from '../attendance-marker/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name: string;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    // this.name = this.auth.userEmail.split('@')[0];
  }


}
