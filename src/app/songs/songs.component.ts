import { Component, OnInit } from '@angular/core';
import { SpotifyUtil } from '../lib/util'; 
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-songs',
  providers: [ SpotifyService ],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  service: SpotifyService;
  tracksRes: any;

  constructor(service: SpotifyService) {
    this.service = service;
  }

  ngOnInit() {
    console.log("SongsComponent::ngOnInit(), hashParams=" + JSON.stringify(SpotifyUtil.getHashParams()));
    this.service.getAccessToken2().subscribe(atokres => this.parseAtokRes(atokres));
  }

  private parseAtokRes(res) {
    console.log("SongsComponent::parseAtokRes(), res=" + JSON.stringify(res));
    if (res) {
      if (res.access_token) {
        this.service.setAtok(res.access_token);
        this.service.getTracks2().subscribe(tracksRes => { 
          console.log('SongsComponent::parseAtokRes(), tracksRes=' + JSON.stringify(tracksRes));
          this.setTracks(tracksRes); 
        });
      } else if (res.error) {
        this.service.setAtok(null);
        alert("Error getting API Token from Spotify: " + res.error);
      }
    }
  }

  private setTracks(tracksRes: any) {
    console.log("SongsComponent::setTracks(), tracks=" + JSON.stringify(tracksRes));
    this.tracksRes = tracksRes;
  }
}
