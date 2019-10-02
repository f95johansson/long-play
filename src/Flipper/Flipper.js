import * as Vibrant from 'node-vibrant'
import autoBind from 'auto-bind';

import Component from 'Component';
import { htmlToElement, childIndex } from 'Utils';

import view from './Flipper.hbs';

import './Flipper.scss';

class Flipper extends Component {
    constructor(spotify) {
        super(view);
        autoBind(this);


        this.spotify = spotify;

        this.flippers = [];
        this.active = null;
        


        document.querySelector('#albums').addEventListener('click', e => {
            if (!e.target.closest('.flipper')) {
                this.close();
            }
        });

    }

    flip(albumView, album) {
        let top = albumView.offsetTop;
        let left = albumView.offsetLeft;
        let width = albumView.offsetWidth;
        let height = albumView.offsetHeight;

        let position = albumView.getBoundingClientRect();
        height = position.height;
        width = position.width;
        top = position.top + window.scrollY;
        left = position.left + window.scrollX;

        // tanslate out from window edges
        let margin = 40;
        let topToTranlate   = Math.min(Math.max(position.top,  (537-height)/2 + margin), window.innerHeight - (537+height)/2 - margin) + window.scrollY - top;
        let leftToTranslate = 0;
        if (window.innerWidth > 642) {
            leftToTranslate = Math.min(Math.max(position.left, (537-width)/2 + margin),  window.innerWidth  - (537+width)/2  - margin) + window.scrollX - left;
        }

        Vibrant.from(albumView.src).getPalette()
        .then((palette) => {
            let flipperView = this.renderElement({ albumCover: albumView.src, coverColor: palette.DarkVibrant.getHex(), album: album });
            flipperView.style.top = top+'px';
            flipperView.style.left = left+'px';
            flipperView.style.width = width+'px';
            flipperView.style.height = height+'px';
            document.body.appendChild(flipperView);
            this.setActive(flipperView, albumView, album)


            let cover = flipperView.querySelector('.album-cover');
            if (cover.complete) {
                albumView.style.opacity = 0;
                window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
                    flipperView.classList.add('flip');
                    flipperView.style.transform = 'translate('+ leftToTranslate +'px, '+ topToTranlate +'px)';
                }));
            } else {
              cover.addEventListener('load', () => {
                  albumView.style.opacity = 0;
                  window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
                    flipperView.classList.add('flip');
                    flipperView.style.transform = 'translate('+ leftToTranslate +'px, '+ topToTranlate +'px)';
                }));
              })
            }
        });
    }

    setActive(flipperView, albumView, album) {
        this.active = flipperView;
        this.flippers.push([flipperView, albumView]);
        this.active.querySelectorAll('.track').forEach(track => 
            track.addEventListener('click', e => {
                this.spotify.play(album, parseInt(e.target.closest('.track').querySelector('.number').innerHTML) || 1);
                e.stopPropagation();
            }
        ));

        this.active.querySelector('.close').addEventListener('click', this.close);

        for (var i = this.flippers.length - 1; i >= 0; i--) {
            let [flipper, albumView] = this.flippers[i];
            if (flipper !== this.active) { 
                this.flippers.splice(i, 1);
                this._clearFlipper(albumView, flipper);
            }
        }
    }

    close() {
        for (var i = this.flippers.length - 1; i >= 0; i--) {
            let [flipper, albumView] = this.flippers[i];
            this.flippers.splice(i, 1);
            this._clearFlipper(albumView, flipper);
        }
    }

    _clearFlipper(albumView, flipper) {
        flipper.classList.remove('flip');
        flipper.style.transform = null;
        flipper.addEventListener('transitionend', e => {
            albumView.style.opacity = 1;
            try {
                document.body.removeChild(flipper);
            } catch {
                // already removed
            }
        })
    }
}

export default Flipper;