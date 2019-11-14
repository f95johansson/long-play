import Component from 'Component';
import { inViewport } from 'Utils'

import view from './Albums.hbs';
import './Albums.scss';

class Albums extends Component {
    constructor(root, flipper, spotify) {
        super(view, root);
        this.flipper = flipper;
        this.spotify = spotify;
        this.albumsById = {};

        this.active = localStorage.getItem('long-play-album-menu') || 'alphabet';

        this._mobile_last_touch = {x: 0, y: 0, stack: null};

        this._update();

        this.spotify.onUpdate(this._update);

        this.loadImagesOnScroll();
    }

    _update() {
        let albums = this.spotify.getAlbumsGroupedList(this.active);
        this.update({ albums: albums, active: this.active });

        this.root.querySelector('.refresh').classList.remove('loading');
        
        this.root.querySelectorAll('.nav .tab').forEach(tab => tab.addEventListener('click', this.navSelect));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('click', this.flip));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('wheel', this.scrollStack));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('touchstart', this.mobileScrollStackStart));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('touchmove', this.mobileScrollStack));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('touchend', this.mobileScrollStackEnd));
        this.root.querySelector('.refresh').addEventListener('click', this._update_albums);
    }

    loadImagesOnScroll() {
        window.addEventListener('scroll', e => {
            this.root.querySelectorAll('.stack').forEach(stack => {
                if (!inViewport(stack)) {
                    // stack.querySelectorAll('img.album').forEach(album =>
                    //     this._changeCoverQuality(album, 'low'));
                    this._optimizeStack(stack, 0, 0);
                } else {
                    // let album = stack.querySelector('img.album:last-child');
                    // this._changeCoverQuality(album, 'high')
                    this._optimizeStack(stack);
                }
            });
        });
    }

    navSelect(e) {
        let active = this.root.querySelector('.nav .active')
        active.classList.remove('active');
        e.target.classList.add('active');
        this.active = e.target.dataset.id;
        localStorage.setItem('long-play-album-menu', this.active)
        this._update();
    }

    flip(e) {
        this.flipper.flip(e.target, this.spotify.getAlbum(e.target.id));
        e.stopPropagation()
    }

    _update_albums() {
        this.root.querySelector('.refresh').classList.add('loading');
        this.spotify._downloadLibrary(true);
    }

    mobileScrollStackStart(e) {
        this._mobile_last_touch.x = event.touches[0].pageX;
        this._mobile_last_touch.y = event.touches[0].pageY;
        this._mobile_last_touch.stack = e.target.closest('.stack');
    }

    mobileScrollStack(e) {
        let deltaX = this._mobile_last_touch.x - event.touches[0].pageX;
        let deltaY = this._mobile_last_touch.y - event.touches[0].pageY;
        this._mobile_last_touch.x = event.touches[0].pageX;
        this._mobile_last_touch.y = event.touches[0].pageY;
        e.deltaX = deltaX;
        e.deltaY = deltaY;
        this.scrollStack(e);
    }

    mobileScrollStackEnd(e) {
        let stack = this._mobile_last_touch.stack;
        this._mobile_last_touch = {x: 0, y: 0, stack: null};
        this._afterStackScoll(stack, 2);
    }

    scrollStack(e) {
        let stack = e.target.closest('.stack');
        let covers = stack.firstElementChild;
        if (covers.childElementCount > 1) {
            let first = covers.lastElementChild; // last in stack but first visible
            let last = covers.firstElementChild; // vice versa

            let currentY = 0;
            if (first.style.transform) {
                currentY = parseInt(first.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
            }
            let newY = Math.min(255, Math.max(0, currentY + -e.deltaY));

            if (newY === 0 && e.deltaY > 0) {
                last.style.transform = 'translateY(255px)';
                last.style.opacity = 0;
                last.src = this.spotify.getAlbum(last.id).images.first().url;
                //this._changeCoverQuality(last, 'high');
                //this._changeCoverQuality(first, 'low');
                covers.insertBefore(last, null); // insert last in first
                this._optimizeStack(stack);

            } if (newY === 255) {
                first.style.transform = null;
                first.style.opacity = 1;
                first.src = this.spotify.getAlbum(first.id).images.last().url;
                //this._changeCoverQuality(first, 'low');
                //this._changeCoverQuality(first.previousElementSibling, 'high');
                covers.insertBefore(first, last); // move first to last
                this._optimizeStack(stack);
            } else {
                first.style.transform = 'translateY('+newY+'px)';
                first.style.opacity = Math.max(0, Math.min(1, 1 - newY/255));
            }
            e.preventDefault();

            if (e instanceof WheelEvent) {
                let isScrolling = stack.dataset.scrollStop;
                window.clearTimeout(isScrolling);
                // detect stop scroll
                stack.dataset.scrollStop = setTimeout(() => {
                    this._afterStackScoll(stack);
                }, 200);
            }
        }
    }

    _afterStackScoll(stack, sensitivity=1) {
        // stop scrolling
        let covers = stack.firstElementChild;
        let first = covers.lastElementChild; // last in stack but first visible
        let last = covers.firstElementChild; // vice versa
        
        let currentY = 0;
        if (first.style.transform) {
            currentY = parseInt(first.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
        }
        if (currentY > 150 * 1/(sensitivity || .0001)) {
            // move foremost cover to last
            first.style.transition = 'transform .3s, opacity .3s';
            first.style.transform = 'translateY(255px)';
            first.style.opacity = 0;
            first.addEventListener('transitionend', e => {
                //this._changeCoverQuality(first, 'low');
                //this._changeCoverQuality(first.previousElementSibling, 'high');
                covers.insertBefore(first, last); // move first to last
                this._optimizeStack(stack);
                first.style.transition = null;
                first.style.transform = null;
                first.style.opacity = 1;
            }, {once: true});
        } else {
            // move foremost cover back to normal position
            first.style.transition = 'transform .3s';
            first.style.transform = null;
            first.style.opacity = 1;
            first.addEventListener('transitionend', () => {
                first.style.transition = null;
            }, {once: true});
        }
    }

    _optimizeStack(stack, highQuality=3, visible=7) {
        let stacks = stack.querySelectorAll('img.album');
        for (var j = stacks.length - 1, i = 0; j >= 0; j--, i++) {
            let album = stacks[j];

            if (i < highQuality) {
                this._changeCoverQuality(album, 'high')
            } else {
                this._changeCoverQuality(album, 'low')
            }
            if (i < visible) {
                if (album.style.display) album.style.display = null;
            } else {
                if (!album.style.display) album.style.display = 'none';
            }
        }
    }

    _changeCoverQuality(album, quality='high') {
        let checkAndSet = (image) => {
            if (album.src !== image) {
                album.src = image;
            }
        }

        if (quality === 'high') {
            checkAndSet(this.spotify.getAlbum(album.id).images.first().url);
        } else if (quality === 'medium') {
            checkAndSet(this.spotify.getAlbum(album.id).images[1].url);
        } else if (quality === 'low') {
            checkAndSet(this.spotify.getAlbum(album.id).images.last().url);
        } else {
            checkAndSet(this.spotify.getAlbum(album.id).images.first().url);
        }
    }
}

export default Albums;