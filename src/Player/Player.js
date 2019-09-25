import Component from 'Component';

import view from './Player.hbs';
import './Player.scss';

class Player extends Component {
    constructor(root, spotify) {
        super(view);
        this.root = root;

        this.root.innerHTML = this.render({ playing: false });

        spotify.onPlay(this.play);

        this.root.addEventListener('click', this.toggleExpand);

        document.body.addEventListener('click', e => {
            if (!e.target.closest('#player')) {
                this.root.classList.remove('expanded');
            }
        });
    }

    play(album) {

        this.root.innerHTML = this.render({ 
            playing: true, 
            albumId: album.id,
            trackInfo: `${album.tracks.items[0].name} - ${album.artists[0].name} - ${album.name}`, 
            albumCover: album.images[0].url});
        this.toggleExpand()
    }

    toggleExpand() {
        this.root.classList.toggle('expanded');
    }
}

export default Player;