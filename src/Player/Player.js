import * as Vibrant from 'node-vibrant'

import Component from 'Component';
import removeRemaster from 'helpers/removeRemaster';
import { darken } from 'Utils'; 

import view from './Player.hbs';
import './Player.scss';

class Player extends Component {
    constructor(root, spotify) {
        super(view, root);
        this.spotify = spotify;

        this.loaded = false;
        this.playing = false;

        this.update({ loaded: this.loaded });

        spotify.onPlay(this.play);
        spotify.onPause(this._pause);
        spotify.onResume(this._resume);

        this.root.querySelector('.display').addEventListener('click', this.toggleExpand);

        document.body.addEventListener('click', e => {
            if (!e.target.closest('#player')) {
                this.collapse();
            }
        });
    }

    play(album, trackNumber=1, playing=true) {
        this.loaded = true;
        this.playing = playing;

        this.root.classList.add('active');
        this.update({ 
            loaded: true, 
            playing: this.playing,
            album: album,
            currentTrackNumber: trackNumber,
            trackInfo: `${removeRemaster(album.tracks.items[trackNumber-1].name)} --- ${album.artists[0].name} --- ${removeRemaster(album.name)}`, 
            albumCover: album.images[0].url});

        this.root.querySelector('.track.active').scrollIntoView({ behavior: 'smooth' });
        this.root.querySelector('.album-art').addEventListener('click', this.toggle);
        this.root.querySelector('.display').addEventListener('click', this.toggleExpand);
        this.root.querySelector('.fullscreen-button').addEventListener('click', this.toggleFullscreen);
        this.root.querySelectorAll('.track').forEach(track => {
            track.removeEventListener('click', 'player.play-track');
            track.addEventListener('click', 'player.play-track', e => {
                console.log(album.name);
                this.spotify.play(album, parseInt(e.target.closest('.track').querySelector('.number').innerHTML) || 1);
                e.stopPropagation();
            })
        });

        Vibrant.from(album.images[0].url).getPalette()
        .then((palette) => {
            this.root.querySelector('.content').style.background = `linear-gradient(#190511, ${darken(palette.DarkVibrant.getHex(), .5)})`;
            this.root.style.background = `radial-gradient(${darken(palette.DarkVibrant.getHex(), .5)}, #190511)`;
        });

        if (!playing) {
            this._pause()
        }
        this.expand()
    }

    toggle(e) {
        this.root.querySelector('.album-art').classList.toggle('playing');
        if (this.playing) {
            this.pause();
        } else {
            this.resume();
        }
        e.stopPropagation()
    }

    resume() {
        this.spotify.resume().then(this._resume);
    }

    _resume() {
        this.root.querySelector('.album-art .cover').style.animationPlayState = 'running';
        this.root.querySelectorAll('.track-info').forEach(trackInfo => trackInfo.style.animationPlayState = 'running');
        this.playing = true;
    }

    pause() {
        this.spotify.pause().then(this._pause);
    }

    _pause() {
        this.root.querySelector('.album-art .cover').style.animationPlayState = 'paused';
        this.root.querySelectorAll('.track-info').forEach(trackInfo => trackInfo.style.animationPlayState = 'paused');
        this.playing = false;
    }

    expand() {
        this.root.classList.add('expanded');
    }

    collapse() {
        this.root.classList.remove('expanded');
    }

    toggleExpand() {
        this.root.classList.toggle('expanded');
    }

    toggleFullscreen() {
        this.root.style.transition = '';
        
        this.root.classList.toggle('fullscreen');
    }
}

export default Player;