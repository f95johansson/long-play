import * as Vibrant from 'node-vibrant'

import Component from 'Component';
import removeRemaster from 'helpers/removeRemaster';
import { darken } from 'Utils'; 

import view from './Player.hbs';
import './Player.scss';

class Player extends Component {
    constructor(root, spotify) {
        super(view);
        this.root = root;
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
        this.root.querySelector('.album-art').addEventListener('click', e => {
            this.root.querySelector('.album-art').classList.toggle('playing');
            if (this.playing) {
                this.pause();
            } else {
                this.resume();
            }
            e.stopPropagation()
        });
        this.root.querySelector('.display').addEventListener('click', this.toggleExpand);

        Vibrant.from(album.images[0].url).getPalette()
        .then((palette) => {
            this.root.querySelector('.content').style.background = `linear-gradient(#190511, ${darken(palette.DarkVibrant.getHex(), .5)})`;
        });

        if (!playing) {
            this._pause()
        }
        this.expand()
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
}

export default Player;