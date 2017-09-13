var circularJson = require('circular-json');
var express = require('express');
var app = express();
var path = require('path');
const fallback = require('express-history-api-fallback');
const client_id = 'fee16d25d0d5436a801d8a0c7acd7bf4'; // Your client id
const client_secret = '6b3954de76894dcbbf5ede812a479714'; // Your secret
const redirect_uri = 'http://localhost:4000/songs'; // Your redirect uri
const url_accesstok = 'https://accounts.spotify.com/api/token';

app.use(express.static(path.join(__dirname + '/dist')));

app.use('/', express.static(__dirname + '/dist/index.html'));

app.get('/atok', function(req, res) {
    console.log("server::atok(), req.query.code=" + circularJson.stringify(req.query.code));
    var code = req.params.code;
    console.log("server::atok(), got code req param:" + JSON.stringify(code));
    var hdrs = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic '+ Buffer.from(client_id + ':' + client_secret).toString('base64')
    };
    console.log("server::atok(), hdrs=" + JSON.stringify(hdrs));
    var treq = {
        grant_type: 'client_credentials',
        authorization_code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret
    };
    console.log("server::atok(), treq=" + JSON.stringify(treq));
    var request = require('request');
    var options = {
        url: url_accesstok,
        method: 'POST',
        headers: hdrs,
        qs: treq
    };
    console.log("server::atok(), options=" + JSON.stringify(options));
    request(options, function(error, response, body) {
        if (error) {
            res.send({error: error});
        } else {
            console.log("server::atok(), response from api token: " + JSON.stringify(body));
            res.send(body);
        }
    });
});

app.use(fallback(__dirname + '/dist/index.html'));

var port = process.env.VCAP_APP_PORT || 4000;
var http = require('http').Server(app);
http.listen(port);
