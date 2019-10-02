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
        
        this.root.querySelectorAll('.nav .tab').forEach(tab => tab.addEventListener('click', this.navSelect));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('click', this.flip));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('wheel', this.scrollStack));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('touchstart', this.mobileScrollStackStart));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('touchmove', this.mobileScrollStack));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('touchend', this.mobileScrollStackEnd));
    }

    loadImagesOnScroll() {
        window.addEventListener('scroll', e => {
            this.root.querySelectorAll('.stack').forEach(stack => {
                if (!inViewport(stack)) {
                    stack.querySelectorAll('img.album').forEach(album => {
                        if (album.src !== this.spotify.getAlbum(album.id).images.last().url) {                            
                            album.src = this.spotify.getAlbum(album.id).images.last().url;
                        }
                    });
                } else {
                    stack.querySelectorAll('img.album').forEach(album => {
                        if (album.src !== this.spotify.getAlbum(album.id).images.first().url) {
                            album.src = this.spotify.getAlbum(album.id).images.first().url;
                        }
                    })
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
            let first = covers.lastElementChild;

            let currentY = 0;
            if (first.style.transform) {
                currentY = parseInt(first.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
            }
            let newY = Math.min(255, Math.max(0, currentY + -e.deltaY));
            if (newY === 0 && e.deltaY > 0) {
                covers.firstElementChild.style.transform = 'translateY(255px)';
                covers.firstElementChild.style.opacity = 0;
                covers.insertBefore(covers.firstElementChild, null); // insert last in first
            } if (newY === 255) {
                covers.insertBefore(covers.lastElementChild, covers.firstElementChild); // move first to last
                first.style.transform = null;
                first.style.opacity = 1;
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
        let first = covers.lastElementChild;
        
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
                    covers.insertBefore(covers.lastElementChild, covers.firstElementChild); // move first to last
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
}

export default Albums;