import * as Vibrant from 'node-vibrant'

import Component from 'Component';
import removeRemaster from 'helpers/removeRemaster';
import { darken } from 'Utils'; 

import view from './FullscreenPlayer.hbs';
import './FullscreenPlayer.scss';

class FullscreenPlayer extends Component {
    constructor(root, spotify) {
        super(view, root);
        this.spotify = spotify;
    }
}

export default FullscreenPlayer;