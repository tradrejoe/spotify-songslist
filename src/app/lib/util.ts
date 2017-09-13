function extend(destination, source) {
  for (var k in source) {
    if (source.hasOwnProperty(k)) {
      destination[k] = source[k];
    }
  }
  return destination;
}

export class SpotifyUtil {

    static client_id: string = 'fee16d25d0d5436a801d8a0c7acd7bf4'; // Your client id
    static client_secret: string = '6b3954de76894dcbbf5ede812a479714'; // Your secret
    static redirect_uri: string = 'http://localhost:4000/songs'; // Your redirect uri
    static scope = 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-follow-read user-library-read user-library-modify user-read-private user-read-birthdate user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-recently-played';

    static getHashParams() {
        console.log("SpotifyUtil::getHashParams(), window.location.search=" + window.location.search);
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.search.substring(1);
        while ( e = r.exec(q)) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
      }
    
    static generateRandomString(length): string {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    static createHashParams(arg) {
      var out: string = '';
      for (var p in arg) {
        if (arg.hasOwnProperty(p))
          out += p + '=' + encodeURIComponent(arg[p]) + '&';
      }
      return out;
    }

    static createAuthReq() {
      return {
        response_type: 'code',
        client_id: SpotifyUtil.client_id,
        scope: SpotifyUtil.scope,
        redirect_uri: SpotifyUtil.redirect_uri,
        state: SpotifyUtil.generateRandomString(16)
      };
    }

    static createAccessReq(code: string) {
      return {
        //grant_type: 'authorization_code',
        grant_type: 'client_credentials',
        authorization_code: code,
        redirect_uri: this.redirect_uri,
        client_id: this.client_id,
        client_secret: this.client_secret
      }
    }

}