import Component from 'Component';

import view from './Albums.hbs';
import './Albums.scss';

class Albums extends Component {
    constructor(root, flipper, spotify) {
        super(view);

        this.root = root;
        this.flipper = flipper;
        this.spotify = spotify;
        this.albumsById = {};

        this.active = 'alphabet';

        this.update();

        this.spotify.onUpdate(this.update);
    }

    update() {
        let albums = this.spotify.getAlbumsGroupedList();
        this.root.innerHTML = this.render({ albums: albums, active: this.active });
        
        this.root.querySelectorAll('.nav .tab').forEach(tab => tab.addEventListener('click', this.navSelect));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('click', this.flip));
        this.root.querySelectorAll('.stack').forEach(stack => stack.addEventListener('wheel', this.scrollStack));
    }

    navSelect(element) {
        let active = this.root.querySelector('.nav .active')
        this.active = active.dataset.id;
        active.classList.remove('active');
        element.target.classList.add('active');
    }

    flip(e) {
        this.flipper.flip(e.target, this.spotify.getAlbum(e.target.id));
        e.stopPropagation()
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

            this._afterStackScoll(stack);
        }
    }

    _afterStackScoll(stack) {
        // detect stop scroll
        let isScrolling = stack.dataset.scrollStop;
        window.clearTimeout(isScrolling);
        stack.dataset.scrollStop = setTimeout(function() {
            // stop scrolling
            let covers = stack.firstElementChild;
            let first = covers.lastElementChild;
            
            let currentY = 0;
            if (first.style.transform) {
                currentY = parseInt(first.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
            }
            if (currentY > 150) {
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
                first.style.transition = 'transform .3s';
                first.style.transform = null;
                first.style.opacity = 1;
                first.addEventListener('transitionend', () => {
                    first.style.transition = null;
                }, {once: true});
            }

        }, 400);
    }
}

export default Albums;