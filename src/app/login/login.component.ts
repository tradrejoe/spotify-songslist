import { Component, OnInit } from '@angular/core';
import { SpotifyUtil } from '../lib/util';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-login',
  providers: [ SpotifyService ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  service: SpotifyService;

  constructor(service: SpotifyService) { 
    this.service = service;
  }
  
  ngOnInit() {
  }

  dologin() {
    this.service.dologin();
  }
}
