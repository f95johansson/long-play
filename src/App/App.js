import '../../index.html';

import Component from 'Component';
import autoBind from 'auto-bind';

import Spotify from 'Spotify';
import Deck from 'Deck/Deck';
import Albums from 'Albums/Albums';
import Flipper from 'Flipper/Flipper';
import Player from 'Player/Player';

import './App.scss';

class App {
    constructor() {

        this.spotify = new Spotify();
        this.player = {};

        this.stateKey = 'longplay-spotify-state';
        this.accessTokenKey = 'longplay-access-token';
        this.loggedIn = false;

        this.flipper = new Flipper(this.spotify);

        this.deck = new Deck(document.querySelector('#deck'), this.flipper, this.spotify);
        this.albums = new Albums(document.querySelector('#albums'), this.flipper, this.spotify);
        this.player = new Player(document.querySelector('#player'), this.spotify);

        autoBind(this);

        document.getElementById('login-button').addEventListener('click', this.login);
        document.getElementById('logout-button').addEventListener('click', this.logout);
        this.checkLogin();


        // navigator.mediaDevices.getUserMedia({ audio: true })
        // .then(function(stream) {
        //   console.log(stream)
        // })
        // .catch(function(err) {
        //   console.log(err)
        // });
    }

    update() {
    }

    showLogin() {
        this.loggedIn = false;
        document.getElementById('login-button').style.display = 'inline-block';
        document.getElementById('logout-button').style.display = 'none';
    }

    removeLogin() {
        this.loggedIn = true;
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('logout-button').style.display = 'inline-block';
    }

    checkLogin() {
        let accessToken = localStorage.getItem(this.accessTokenKey);
        if (accessToken) {
            this.spotify.login(accessToken)
            .then(() => {
                this.removeLogin();
            }).catch(err => {
                this.showLogin();
                localStorage.removeItem(this.accessTokenKey);
                localStorage.removeItem(this.stateKey);
                this.checkLogin();
            });


        } else {
            let params = getHashParams();
            accessToken = params.access_token;
            let state = params.state;
            let storedState = localStorage.getItem(this.stateKey);
            window.history.pushState({}, "", window.location.href.split('#')[0]);
            if (accessToken && (state == null || state !== storedState)) {
                  this.showLogin();
            } else {
                  localStorage.removeItem(this.stateKey);
                  if (accessToken) {
                      this.removeLogin();
                      this.accessToken = accessToken;
                      localStorage.setItem(this.accessTokenKey, accessToken);
                      this.checkLogin();
                  } else {
                      this.showLogin();
                  }
            }
        }
    }

    login() {
        var clientId = 'fae9db52f63e4dcbae74a6f6dea3dc5e';
        var redirectUri = window.location.href.split('#')[0]; 
        console.log(redirectUri)
        var state = generateRandomString(16);
        localStorage.setItem(this.stateKey, state);
        var scope = 'user-library-read user-read-recently-played user-modify-playback-state user-read-currently-playing user-read-playback-state';
        var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(clientId);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirectUri);
        url += '&state=' + encodeURIComponent(state);
        console.log(url)
        window.location = url;
    }

    logout() {
      localStorage.removeItem(this.accessTokenKey);
      window.location.reload();
    }
}


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}


const app = new App();