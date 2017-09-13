import { Injectable } from '@angular/core';
import { SpotifyUtil } from './lib/util';
import { Http, Headers, URLSearchParams, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

export const url_auth: string = 'https://accounts.spotify.com/authorize?';
export const url_accesstok: string = 'https://accounts.spotify.com/api/token';
export const url_accesstok2: string = 'http://localhost:4000/atok';
export const url_tracks: string = 'https://api.spotify.com/v1/me/tracks';
export const msg_nocode: string = 'Code not found in spotify login response.';

@Injectable()
export class SpotifyService {
  http: Http;
  code: string;
  state: string;
  atok: string;

  getAtok(): string { return this.atok; }
  setAtok(atok: string) { this.atok = atok; }

  constructor(http: Http) { 
      this.http = http;
  }

  dologin() {
    console.log("LoginComponent::dologin()...");
    let tmp = SpotifyUtil.createAuthReq();
    this.state = tmp.state;
    window.location.href = url_auth + SpotifyUtil.createHashParams(tmp);
  }

  //deprecated due to same origin restriction, get access token on server side instead with getAccessToken2
  getAccessToken() {
    let loginRes: any = SpotifyUtil.getHashParams();
    if (!loginRes || !loginRes.code) {
      console.log("SpotifyService::getAccessToken(), " + msg_nocode);
      alert(msg_nocode);
      return null;
    } else {
      this.code = loginRes.code;
      let req = SpotifyUtil.createAccessReq(this.code);
      /*let headers = new Headers();
      headers.append('Authorization', 'Basic '+btoa(SpotifyUtil.client_id + ':' + SpotifyUtil.client_secret));*/
      let hdrs = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+btoa(SpotifyUtil.client_id + ':' + SpotifyUtil.client_secret)
      });
      let options = new RequestOptions({headers: hdrs});
      let res: Observable<any> = this.http.post(url_accesstok, SpotifyUtil.createHashParams(req), options)
        //.map(this.extractData)
        .map((res: Response) => res.json())
        //.do(data => console.log(JSON.stringify(data)))
        ;
      console.log("SpotifyService:getAccessToken(), access token respose: " + JSON.stringify(res));
      return res;
    }
  }

  getAccessToken2() {
    let loginRes: any = SpotifyUtil.getHashParams();
    if (!loginRes || !loginRes.code) {
      console.log("SpotifyService::getAccessToken2(), " + msg_nocode);
      alert(msg_nocode);
      return null;
    } else {
      this.code = loginRes.code;
      let req ={code: this.code};
      console.log("SpotifyService:getAccessToken2(), window.location: " + JSON.stringify(window.location));
      let res: Observable<any> = this.http.get(window.location.origin + '/atok?' + SpotifyUtil.createHashParams(req))
        //.map(this.extractData)
        .map((res: Response) => res.json())
        //.do(data => console.log(JSON.stringify(data)))
        ;
      console.log("SpotifyService:getAccessToken2(), access token respose: " + JSON.stringify(res));
      return res;
    }
  }

  private extractData(res: Response) {
    let body = res.json();
    // alert("body: " + body);
    return body.docs || {};
  }

  private handleError (error: any) {
      // In a real world app, we might use a remote logging infrastructure
      // We'd also dig deeper into the error to get a better message
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
      return Observable.throw(errMsg);
  }

  getTracks(): Observable<any> {

    let headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      //'Access-Control-Allow-Headers': 'Content-Type', //not allowed by spotify
      'Authorization': "Bearer " + this.getAtok()
    }
    
    let headerObj = {                                                                                                                                                                                 
      headers: new Headers(headerDict), 
    };
    
    /*let headers: Headers = new Headers();
    headers.append('Authorization', "Bearer " + this.getAtok());*/
    //headers.append('Access-Control-Allow-Origin', "*");
    //let options: RequestOptions = new RequestOptions({headers: headers});
    //let res: any = this.http.get(url_tracks, options).map((res: Response) => res.json());
    let res: any = this.http.get(url_tracks, headerObj).map((res: Response) => res.json());
    console.log("SpotifyService:getTracks(), tracks respose: " + JSON.stringify(res));
    return res;
  }
}
