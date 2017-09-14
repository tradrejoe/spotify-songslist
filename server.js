var circularJson = require('circular-json');
var express = require('express');
var app = express();
var path = require('path');
const fallback = require('express-history-api-fallback');
const client_id = 'fee16d25d0d5436a801d8a0c7acd7bf4'; // Your client id
const client_secret = '6b3954de76894dcbbf5ede812a479714'; // Your secret
const redirect_uri = 'http://localhost:4000/songs'; // Your redirect uri
const url_accesstok = 'https://accounts.spotify.com/api/token';
const url_tracks = 'https://api.spotify.com/v1/me/tracks';

app.use(express.static(path.join(__dirname + '/dist')));

app.use('/', express.static(__dirname + '/dist/index.html'));

app.get('/atok', function(req, res) {
    console.log("server::atok(), req=" + circularJson.stringify(req));
    var code = req.params.code;
    console.log("server::atok(), got code req param:" + circularJson.stringify(code));
    var hdrs = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+ Buffer.from(client_id + ':' + client_secret).toString('base64')
    };
    console.log("server::atok(), hdrs=" + circularJson.stringify(hdrs));
    var treq = {
        grant_type: 'client_credentials',
        authorization_code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret
    };
    console.log("server::atok(), treq=" + circularJson.stringify(treq));
    var request = require('request');
    var options = {
        url: url_accesstok,
        method: 'POST',
        headers: hdrs,
        qs: treq
    };
    console.log("server::atok(), options=" + circularJson.stringify(options));
    request(options, function(error, response, body) {
        if (error) {
            res.send({error: error});
        } else {
            console.log("server::atok(), response from api token: " + circularJson.stringify(body));
            res.send(body);
        }
    });
});

app.get('/tracks', function(req, res) {
    console.log('server::tracks(), req.headers=' + circularJson.stringify(req.headers));
    var atok = req.headers.atok;
    var hdrs = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Access-Control-Allow-Headers': 'Content-Type', //not allowed by spotify
        'Accept-Encoding': 'gzip, deflate, compress',
        'User-Agent': 'Spotify API Console v0.1',
        'Authorization': "Bearer " + atok
    };
    var request = require('request');
    var options = {
        url: url_tracks,
        method: 'GET',
        headers: hdrs
    };
    request(options, function(error, response, body){
        if (error) {
            res.send({error: error});
        } else {
            console.log('server::tracks(), response from tracks api: ' + circularJson.stringify(response));
            res.send(body);
        }
    });
});

app.use(fallback(__dirname + '/dist/index.html'));

var port = process.env.VCAP_APP_PORT || 4000;
var http = require('http').Server(app);
http.listen(port);
