import SpotifyWebApi from 'spotify-web-api-js';
import autoBind from 'auto-bind';

class Spotify {
    constructor() {
        this.api = new SpotifyWebApi();

        this.updateListeners = new Set();
        this.playListeners   = new Set();

        this.albums = [];
        this.albumsById = {}
        
        autoBind(this);
    }

    login(accessToken) {
        return new Promise((resolve, reject) => {
            this.api.setAccessToken(accessToken);
            this.api.getMe().then(me => {
                this._downloadLibrary()
                resolve();
            }).catch(err => {
                this.api.setAccessToken(null);
                reject();
            });
        });
    }

    _downloadLibrary() {
        this.albums = [];
        if (false && localStorage.getItem('albums') !==  null) {
            this.albums = JSON.parse(localStorage.getItem('albums'));
            for (let album of this.albums) {
                this.albumsById[album.id] = album;
            }
            this._distributeUpdates();
            // this.api.getMyRecentlyPlayedTracks().then(response => {
            //     console.log(response);
            // });
        } else {

            this._downloadAlbums().then(() => {
                //localStorage.setItem('albums', JSON.stringify(this.albums));
                return this.api.getMyRecentlyPlayedTracks();
            }).then(response => {
                this._distributeUpdates();
            }).catch(err => {
                console.log(err);
            });
        }


    }

    _downloadAlbums(offset=0) {
        return this.api.getMySavedAlbums({limit: 50, offset: offset}).then(response => {

            this.albums.extend(response.items.map(info => info.album));
            for (let album of this.albums) {
                this.albumsById[album.id] = album;
            }
            if (this.albums.length < response.total) {
                return this._downloadAlbums(offset=offset + 50);
            }            
        });
    }

    play(album) {
        this._distributePlay(album);
    }

    getAlbum(id) {
        return this.albumsById[id];
    }

    getAlbums() {
        return this.albums;
    }

    getAlbumsGrouped() {
        let albumsGrouped = {};
        for (let album of this.getAlbums()) {
            let letter = album.name[0].toUpperCase();
            if (albumsGrouped[letter]) {
                albumsGrouped[letter].push(album);
            } else {
                albumsGrouped[letter] = [album];
            }
        }
        return albumsGrouped;
    }

    getAlbumsGroupedList() {
        let albumsGroupedList = Object.entries(this.getAlbumsGrouped()).sort((a, b) => {
            if (a[0] < b[0]) {
                return -1;
            } else if (a[0] > b[0]) {
                return 1;
            } else {
                return 0;
            }
        })
        return albumsGroupedList;
    }

    onUpdate(callback) {
        this.updateListeners.add(callback);
    }

    _distributeUpdates() {
        this.updateListeners.forEach(callback => callback())
    }

    onPlay(callback) {
        this.playListeners.add(callback);
    }

    _distributePlay(album) {
        this.playListeners.forEach(callback => callback(album))
    }
}

function cleanAlbums(albums) {

}


Array.prototype.extend = function (other_array) {
    if (Array.isArray(other_array)) {
        for (let v of other_array) {
            this.push(v);
        }
    } else {
        throw 'Cannot extend with non-array';
    }
}

export default Spotify;

