import SpotifyWebApi from 'spotify-web-api-js';
import autoBind from 'auto-bind';

class Spotify {
    constructor() {
        this.api = new SpotifyWebApi();

        this.updateListeners = new Set();
        this.playListeners   = new Set();
        this.pauseListeners   = new Set();
        this.resumeListeners   = new Set();
        this.loadedListeners = new Set();
        this.loggedOutListeners = new Set();

        this.albums = [];
        this.albumsById = {}

        this.lastPlayedAlbum = null;

        this.recentlyPlayed = JSON.parse(localStorage.getItem('long-play-recent-albums') || '[]');
        
        autoBind(this);
    }

    login(accessToken) {
        return new Promise((resolve, reject) => {
            this.api.setAccessToken(accessToken);
            this.api.getMe().then(me => {
                this._downloadLibrary()
                resolve();
                this._distribute(this.loadedListeners);
                this.checkPlaying();
            }).catch(err => {
                this.api.setAccessToken(null);
                reject();
            });
        });
    }

    checkPlaying() {
        setInterval(() => {
            this.isPlaying().then(context => {
                if (context && context.is_playing) {
                    if (context.item.album.id !== this.lastPlayedAlbum || context.item.track_number !== this.lastPlayedTrackNumber) {
                        this.loadAlbum(context.item.album.id)
                        .then(album => {
                            this.lastPlayedAlbum = album.id;
                            this.lastPlayedTrackNumber = context.item.track_number;
                            this._distribute(this.playListeners, album, context.item.track_number);
                        });
                    } else {
                        this._distribute(this.resumeListeners);
                    }
                } else if (context && !context.is_playing) {
                    if (context.item.album.id !== this.lastPlayedAlbum) {
                        this.loadAlbum(context.item.album.id)
                        .then(album => {
                            this.lastPlayedAlbum = album.id;
                            this._distribute(this.playListeners, album, context.item.track_number, false);
                        });
                    } else {
                        this._distribute(this.pauseListeners);
                    }
                }
            });
        }, 2000);
    }

    _downloadLibrary() {
        this.albums = [];
        if (process.env.DEV && localStorage.getItem('albums') !==  null) {
            this.albums = JSON.parse(localStorage.getItem('albums'));
            for (let album of this.albums) {
                this.albumsById[album.id] = album;
            }
            this._distribute(this.updateListeners)
            // this.api.getMyRecentlyPlayedTracks().then(response => {
            //     console.log(response);
            // });
        } else {

            this._downloadAlbums().then(() => {
                console.log('loaded new albums')
                if (process.env.DEV) { localStorage.setItem('albums', JSON.stringify(this.albums)) };
                return this.api.getMyRecentlyPlayedTracks();
            }).then(response => {
                this._distribute(this.updateListeners);
            }).catch(this._handleError);
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

    play(album, trackNumber=1) {
        this.recentlyPlayed.push(album);
        if (this.recentlyPlayed.length > 4) {
            this.recentlyPlayed = this.recentlyPlayed.slice(-4);
        }
        localStorage.setItem('long-play-recent-albums', JSON.stringify(this.recentlyPlayed));
        this.api.play({context_uri: album.uri, offset: {position: trackNumber-1}}).then(reponse => {
            this.lastPlayedAlbum = album.id;
            this.lastPlayedTrackNumber = trackNumber;
            this._distribute(this.playListeners, album, trackNumber);
        }).catch(err => {
            if (err.status === 404) {
                return this.api.getMyDevices();
            } else {
                console.log(err);
            }
        }).then(response => {
            if (!response) return;
            if (response.devices.length > 0) {
                return this.api.play({context_uri: album.uri, device_id: response.devices[0].id, offset: {position: trackNumber-1}})
            } else {
                console.log('No devices to play on')
            }
        }).then(response => {
            this.lastPlayedAlbum = album.id;
            this._distribute(this.playListeners, album, trackNumber);
        }).catch(console.log);
    }

    isPlaying() {
        return this._handleApi(this.api.getMyCurrentPlaybackState);
    }

    loadAlbum(id) {
        return this._handleApi(this.api.getAlbum, id);
    }

    resume() {
        return this._handleApi(this.api.play);
    }

    pause() {
        return this._handleApi(this.api.pause);
    }

    getRecentlyPlayed() {
        return reverseArray(this.recentlyPlayed);
    }

    getAlbum(id) {
        return this.albumsById[id];
    }

    getAlbums() {
        return this.albums;
    }

    getAlbumsGrouped(grouping='alphabet') {
        let albumsGrouped = {};
        for (let album of this.getAlbums()) {
            let group
            if (grouping === 'alphabet') {
                group = album.name[0].toUpperCase();
            } else if (grouping === 'year') {
                group = parseInt(onlyYear(album.release_date)) | 0;
            } else {
                group = album.name[0].toUpperCase();
            }
            
            if (albumsGrouped[group]) {
                albumsGrouped[group].push(album);
            } else {
                albumsGrouped[group] = [album];
            }
        }
        return albumsGrouped;
    }

    getAlbumsGroupedList(grouping='alphabet') {
        let albumsGroupedList = Object.entries(this.getAlbumsGrouped(grouping)).sort((a, b) => {
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

    _handleApi(apiCall, ...args) {
        return new Promise((resolve, reject) => {
            apiCall(...args).then(response => {
                resolve(response);
            }).catch(err => {
                if (err.status === 401) {
                    this._distribute(this.loggedOutListeners);
                } else {
                    reject(err);
                }
            });
        });
    }

    _handleError(response) {
        if (response.status === 401) {
            this._distribute(this.loggedOutListeners);
        } else {
            console.log(response);
        }
    }

    _distribute(listeners, ...options) {
        listeners.forEach(callback => callback(...options))
    }

    onUpdate(callback) {
        this.updateListeners.add(callback);
    }

    onPlay(callback) {
        this.playListeners.add(callback);
    }

    onPause(callback) {
        this.pauseListeners.add(callback);
    }

    onResume(callback) {
        this.resumeListeners.add(callback);
    }

    onLoaded(callback) {
        this.loadedListeners.add(callback);
    }

    onLoggedOut(callback) {
        this.loggedOutListeners.add(callback);
    }
}

function cleanAlbums(albums) {

}

function onlyYear(year) {
    return year.toString().slice(0, 4);
}

function reverseArray(array) {
    return array.map((item,idx) => array[array.length-1-idx]);
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

