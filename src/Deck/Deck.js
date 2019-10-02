import autoBind from 'auto-bind'

import Component from 'Component';
import { htmlToElement, childIndex } from 'Utils';

import view from './Deck.hbs';
import './Deck.scss';

class Deck extends Component {
    constructor(root, flipper, spotify) {
        super(view, root);
        autoBind(this);

        this.flipper = flipper;
        this.spotify = spotify;

        this.active = localStorage.getItem('long-play-deck-menu') || 'recent';

        this.spotify.onPlay(this._update)
        
        this._update();
    }

    _update() {
        let albums = this.spotify.getRecentlyPlayed();
        this.update({albums, active: this.active});
        this.root.querySelectorAll('.nav .tab').forEach(tab => tab.addEventListener('click', this.navSelect));
        this.root.querySelectorAll('.album').forEach(stack => stack.addEventListener('click', this.flip));
    }

   flip(e) {
        this.flipper.flip(e.target, this.spotify.getRecentlyPlayed()[childIndex(e.target.parentElement)]);
        e.stopPropagation()
    }

    addNewRecent(album) {
        let albumsView = this.root.querySelector('.albums');
        albumsView.insertBefore(htmlToElement(`<li class="album"><img src="${album.images[0].url}"></li>`), albumsView.firstElementChild);
    }

    navSelect(element) {
        this.root.querySelector('.nav .active').classList.remove('active');
        element.target.classList.add('active');
        this.active = element.target.dataset.id;
        localStorage.setItem('long-play-deck-menu', this.active);
    }
}

const noMeanCity = {
  "album_type": "album",
  "artists": [
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
      },
      "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
      "id": "6fvN9GmMCVKb5LY0WsnjFP",
      "name": "Nazareth",
      "type": "artist",
      "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
    }
  ],
  "copyrights": [
    {
      "text": "2004 Union Square Music Limited, a BMG Company",
      "type": "C"
    },
    {
      "text": "2004 Union Square Music Limited, a BMG Company",
      "type": "P"
    }
  ],
  "external_ids": {
    "upc": "0698458812889"
  },
  "external_urls": {
    "spotify": "https://open.spotify.com/album/5MCOqKupRV1RQJ380x6m3W"
  },
  "genres": [],
  "href": "https://api.spotify.com/v1/albums/5MCOqKupRV1RQJ380x6m3W",
  "id": "5MCOqKupRV1RQJ380x6m3W",
  "images": [
    {
      "height": 640,
      "url": "https://i.scdn.co/image/a91011389117e42a7bca74f5a21a9d0e949e2095",
      "width": 640
    },
    {
      "height": 300,
      "url": "https://i.scdn.co/image/06f4c2c3dfd15ac82174cb77fe74622b0b0aea60",
      "width": 300
    },
    {
      "height": 64,
      "url": "https://i.scdn.co/image/d95ae0fb68244fb7543a8f79611d870262cf6bb3",
      "width": 64
    }
  ],
  "label": "Salvo",
  "name": "No Mean City",
  "popularity": 30,
  "release_date": "1979-01-01",
  "release_date_precision": "day",
  "total_tracks": 10,
  "tracks": {
    "href": "https://api.spotify.com/v1/albums/5MCOqKupRV1RQJ380x6m3W/tracks?offset=0&limit=50&market=SE",
    "items": [
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
            },
            "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
            "id": "6fvN9GmMCVKb5LY0WsnjFP",
            "name": "Nazareth",
            "type": "artist",
            "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 261560,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/6svjyUu2ahWrUQcHa8AL1g"
        },
        "href": "https://api.spotify.com/v1/tracks/6svjyUu2ahWrUQcHa8AL1g",
        "id": "6svjyUu2ahWrUQcHa8AL1g",
        "is_local": false,
        "is_playable": true,
        "name": "Just to Get Into It - 2010 - Remaster",
        "preview_url": "https://p.scdn.co/mp3-preview/a226db8a8b1097afd10b2928c755f4ee5177abb5?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 1,
        "type": "track",
        "uri": "spotify:track:6svjyUu2ahWrUQcHa8AL1g"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
            },
            "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
            "id": "6fvN9GmMCVKb5LY0WsnjFP",
            "name": "Nazareth",
            "type": "artist",
            "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 292080,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/2BfZaMRmYjOCn8AVcfOTUq"
        },
        "href": "https://api.spotify.com/v1/tracks/2BfZaMRmYjOCn8AVcfOTUq",
        "id": "2BfZaMRmYjOCn8AVcfOTUq",
        "is_local": false,
        "is_playable": true,
        "name": "May the Sunshine - 2010 - Remaster",
        "preview_url": "https://p.scdn.co/mp3-preview/177ff26f5a0378fab195ae259f0e1853f30fa158?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 2,
        "type": "track",
        "uri": "spotify:track:2BfZaMRmYjOCn8AVcfOTUq"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
            },
            "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
            "id": "6fvN9GmMCVKb5LY0WsnjFP",
            "name": "Nazareth",
            "type": "artist",
            "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 298080,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/6tYqVzXNtEfxV4fySoqt85"
        },
        "href": "https://api.spotify.com/v1/tracks/6tYqVzXNtEfxV4fySoqt85",
        "id": "6tYqVzXNtEfxV4fySoqt85",
        "is_local": false,
        "is_playable": true,
        "name": "Simple Solution",
        "preview_url": "https://p.scdn.co/mp3-preview/7001d3223b5b08c388550d0feeaa38c3eaa4c7cc?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 3,
        "type": "track",
        "uri": "spotify:track:6tYqVzXNtEfxV4fySoqt85"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
            },
            "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
            "id": "6fvN9GmMCVKb5LY0WsnjFP",
            "name": "Nazareth",
            "type": "artist",
            "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 294200,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/2EfnxPWR8zjJQBwsM4N1rx"
        },
        "href": "https://api.spotify.com/v1/tracks/2EfnxPWR8zjJQBwsM4N1rx",
        "id": "2EfnxPWR8zjJQBwsM4N1rx",
        "is_local": false,
        "is_playable": true,
        "name": "Star",
        "preview_url": "https://p.scdn.co/mp3-preview/e2a6426d0e695a7ee340ca1f1a18853fc8cb4fa8?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 4,
        "type": "track",
        "uri": "spotify:track:2EfnxPWR8zjJQBwsM4N1rx"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
            },
            "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
            "id": "6fvN9GmMCVKb5LY0WsnjFP",
            "name": "Nazareth",
            "type": "artist",
            "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 266786,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/3F6x3sCnksfQUNR48g9vWC"
        },
        "href": "https://api.spotify.com/v1/tracks/3F6x3sCnksfQUNR48g9vWC",
        "id": "3F6x3sCnksfQUNR48g9vWC",
        "is_local": false,
        "is_playable": true,
        "name": "Claim to Fame",
        "preview_url": "https://p.scdn.co/mp3-preview/6e00e5a6015e0c98cf0b381905ea68987aad3ccd?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 5,
        "type": "track",
        "uri": "spotify:track:3F6x3sCnksfQUNR48g9vWC"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
            },
            "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
            "id": "6fvN9GmMCVKb5LY0WsnjFP",
            "name": "Nazareth",
            "type": "artist",
            "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 221626,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/7zeq6BzUIQiKvoVjJ4mDnP"
        },
        "href": "https://api.spotify.com/v1/tracks/7zeq6BzUIQiKvoVjJ4mDnP",
        "id": "7zeq6BzUIQiKvoVjJ4mDnP",
        "is_local": false,
        "is_playable": true,
        "name": "Whatever You Want Babe - Single Edit",
        "preview_url": "https://p.scdn.co/mp3-preview/6c5e8dfd0b36c9629fcc4d00c623d572a3ea8604?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 6,
        "type": "track",
        "uri": "spotify:track:7zeq6BzUIQiKvoVjJ4mDnP"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
            },
            "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
            "id": "6fvN9GmMCVKb5LY0WsnjFP",
            "name": "Nazareth",
            "type": "artist",
            "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 256293,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/61P6kNrLTrHAqD740KWG2N"
        },
        "href": "https://api.spotify.com/v1/tracks/61P6kNrLTrHAqD740KWG2N",
        "id": "61P6kNrLTrHAqD740KWG2N",
        "is_local": false,
        "is_playable": true,
        "name": "What's In It for Me",
        "preview_url": "https://p.scdn.co/mp3-preview/5fc5742e837a3cf01b95affba8699643ce8c7bc3?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 7,
        "type": "track",
        "uri": "spotify:track:61P6kNrLTrHAqD740KWG2N"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
            },
            "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
            "id": "6fvN9GmMCVKb5LY0WsnjFP",
            "name": "Nazareth",
            "type": "artist",
            "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 377226,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/53TV5JLBY8wvBUNDMh3mi5"
        },
        "href": "https://api.spotify.com/v1/tracks/53TV5JLBY8wvBUNDMh3mi5",
        "id": "53TV5JLBY8wvBUNDMh3mi5",
        "is_local": false,
        "is_playable": true,
        "name": "No Mean City - Pts. 1 & 2",
        "preview_url": "https://p.scdn.co/mp3-preview/cdbcf17210c7188148fc66b3d4d50d2e2bf91854?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 8,
        "type": "track",
        "uri": "spotify:track:53TV5JLBY8wvBUNDMh3mi5"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
            },
            "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
            "id": "6fvN9GmMCVKb5LY0WsnjFP",
            "name": "Nazareth",
            "type": "artist",
            "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 211200,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/6JIXCEfhsdrXAvxaV3xh0g"
        },
        "href": "https://api.spotify.com/v1/tracks/6JIXCEfhsdrXAvxaV3xh0g",
        "id": "6JIXCEfhsdrXAvxaV3xh0g",
        "is_local": false,
        "is_playable": true,
        "name": "May the Sunshine - Single Version",
        "preview_url": "https://p.scdn.co/mp3-preview/ccb4aee0d1a1cbeae2f27b13c15d11d479dab080?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 9,
        "type": "track",
        "uri": "spotify:track:6JIXCEfhsdrXAvxaV3xh0g"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6fvN9GmMCVKb5LY0WsnjFP"
            },
            "href": "https://api.spotify.com/v1/artists/6fvN9GmMCVKb5LY0WsnjFP",
            "id": "6fvN9GmMCVKb5LY0WsnjFP",
            "name": "Nazareth",
            "type": "artist",
            "uri": "spotify:artist:6fvN9GmMCVKb5LY0WsnjFP"
          }
        ],
        "disc_number": 1,
        "duration_ms": 217773,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/63OFhu4sLSWcTfbktkMszX"
        },
        "href": "https://api.spotify.com/v1/tracks/63OFhu4sLSWcTfbktkMszX",
        "id": "63OFhu4sLSWcTfbktkMszX",
        "is_local": false,
        "is_playable": true,
        "name": "Snaefell",
        "preview_url": "https://p.scdn.co/mp3-preview/251d88b349cdc734e85807a6cf56da1ae7c46ed5?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 10,
        "type": "track",
        "uri": "spotify:track:63OFhu4sLSWcTfbktkMszX"
      }
    ],
    "limit": 50,
    "next": null,
    "offset": 0,
    "previous": null,
    "total": 10
  },
  "type": "album",
  "uri": "spotify:album:5MCOqKupRV1RQJ380x6m3W"
};

const foolForTheCity = {
  "album_type": "album",
  "artists": [
    {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/6x33CmZWo2Ve4hxYl2Craq"
      },
      "href": "https://api.spotify.com/v1/artists/6x33CmZWo2Ve4hxYl2Craq",
      "id": "6x33CmZWo2Ve4hxYl2Craq",
      "name": "Foghat",
      "type": "artist",
      "uri": "spotify:artist:6x33CmZWo2Ve4hxYl2Craq"
    }
  ],
  "copyrights": [
    {
      "text": "1975 Rhino Entertainment Company, a Warner Music Group Company. All Rights Reserved.",
      "type": "C"
    },
    {
      "text": "2016 Rhino Entertainment Company, a Warner Music Group Company. All Rights Reserved.",
      "type": "P"
    }
  ],
  "external_ids": {
    "upc": "603497877928"
  },
  "external_urls": {
    "spotify": "https://open.spotify.com/album/6A5fIqkWcZEAuhZLf8bLAG"
  },
  "genres": [],
  "href": "https://api.spotify.com/v1/albums/6A5fIqkWcZEAuhZLf8bLAG",
  "id": "6A5fIqkWcZEAuhZLf8bLAG",
  "images": [
    {
      "height": 640,
      "url": "https://i.scdn.co/image/987686ee921416e767e4fff6905032c39f0229df",
      "width": 640
    },
    {
      "height": 300,
      "url": "https://i.scdn.co/image/731b672c0100bff93e38b78b515a1b0a40ebd819",
      "width": 300
    },
    {
      "height": 64,
      "url": "https://i.scdn.co/image/3fb69e9dc85614bec065c948742fe72dbd577331",
      "width": 64
    }
  ],
  "label": "Rhino",
  "name": "Fool For The City (Remastered)",
  "popularity": 35,
  "release_date": "1975",
  "release_date_precision": "year",
  "total_tracks": 7,
  "tracks": {
    "href": "https://api.spotify.com/v1/albums/6A5fIqkWcZEAuhZLf8bLAG/tracks?offset=0&limit=50&market=SE",
    "items": [
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6x33CmZWo2Ve4hxYl2Craq"
            },
            "href": "https://api.spotify.com/v1/artists/6x33CmZWo2Ve4hxYl2Craq",
            "id": "6x33CmZWo2Ve4hxYl2Craq",
            "name": "Foghat",
            "type": "artist",
            "uri": "spotify:artist:6x33CmZWo2Ve4hxYl2Craq"
          }
        ],
        "disc_number": 1,
        "duration_ms": 272000,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/6jyvgy90nOtbIeUPBLGUpP"
        },
        "href": "https://api.spotify.com/v1/tracks/6jyvgy90nOtbIeUPBLGUpP",
        "id": "6jyvgy90nOtbIeUPBLGUpP",
        "is_local": false,
        "is_playable": true,
        "name": "Fool for the City - 2016 Remaster",
        "preview_url": "https://p.scdn.co/mp3-preview/b94dd2e89fbbade5b93e7bcf034fdcbb594dc8b1?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 1,
        "type": "track",
        "uri": "spotify:track:6jyvgy90nOtbIeUPBLGUpP"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6x33CmZWo2Ve4hxYl2Craq"
            },
            "href": "https://api.spotify.com/v1/artists/6x33CmZWo2Ve4hxYl2Craq",
            "id": "6x33CmZWo2Ve4hxYl2Craq",
            "name": "Foghat",
            "type": "artist",
            "uri": "spotify:artist:6x33CmZWo2Ve4hxYl2Craq"
          }
        ],
        "disc_number": 1,
        "duration_ms": 276626,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/1S8HnFNww3VsukO0ODVzss"
        },
        "href": "https://api.spotify.com/v1/tracks/1S8HnFNww3VsukO0ODVzss",
        "id": "1S8HnFNww3VsukO0ODVzss",
        "is_local": false,
        "is_playable": true,
        "name": "My Babe - 2016 Remaster",
        "preview_url": "https://p.scdn.co/mp3-preview/c2b0aa5a86a184c3036469ec6d1a482f17d6e011?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 2,
        "type": "track",
        "uri": "spotify:track:1S8HnFNww3VsukO0ODVzss"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6x33CmZWo2Ve4hxYl2Craq"
            },
            "href": "https://api.spotify.com/v1/artists/6x33CmZWo2Ve4hxYl2Craq",
            "id": "6x33CmZWo2Ve4hxYl2Craq",
            "name": "Foghat",
            "type": "artist",
            "uri": "spotify:artist:6x33CmZWo2Ve4hxYl2Craq"
          }
        ],
        "disc_number": 1,
        "duration_ms": 494626,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/3OccwXSaM4pZ4CiRkaqKX7"
        },
        "href": "https://api.spotify.com/v1/tracks/3OccwXSaM4pZ4CiRkaqKX7",
        "id": "3OccwXSaM4pZ4CiRkaqKX7",
        "is_local": false,
        "is_playable": true,
        "name": "Slow Ride - 2016 Remaster",
        "preview_url": "https://p.scdn.co/mp3-preview/0bf6342ba194deae428596f437254dadec44d250?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 3,
        "type": "track",
        "uri": "spotify:track:3OccwXSaM4pZ4CiRkaqKX7"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6x33CmZWo2Ve4hxYl2Craq"
            },
            "href": "https://api.spotify.com/v1/artists/6x33CmZWo2Ve4hxYl2Craq",
            "id": "6x33CmZWo2Ve4hxYl2Craq",
            "name": "Foghat",
            "type": "artist",
            "uri": "spotify:artist:6x33CmZWo2Ve4hxYl2Craq"
          }
        ],
        "disc_number": 1,
        "duration_ms": 345253,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/3KjR2LgupNv5ewyBjURKPV"
        },
        "href": "https://api.spotify.com/v1/tracks/3KjR2LgupNv5ewyBjURKPV",
        "id": "3KjR2LgupNv5ewyBjURKPV",
        "is_local": false,
        "is_playable": true,
        "name": "Terraplane Blues - 2016 Remaster",
        "preview_url": "https://p.scdn.co/mp3-preview/b55f35085dca34423a2c8fd5bf01d45d7d032b0d?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 4,
        "type": "track",
        "uri": "spotify:track:3KjR2LgupNv5ewyBjURKPV"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6x33CmZWo2Ve4hxYl2Craq"
            },
            "href": "https://api.spotify.com/v1/artists/6x33CmZWo2Ve4hxYl2Craq",
            "id": "6x33CmZWo2Ve4hxYl2Craq",
            "name": "Foghat",
            "type": "artist",
            "uri": "spotify:artist:6x33CmZWo2Ve4hxYl2Craq"
          }
        ],
        "disc_number": 1,
        "duration_ms": 212173,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/2JvKtIooQt7Xkb3rUsQGTd"
        },
        "href": "https://api.spotify.com/v1/tracks/2JvKtIooQt7Xkb3rUsQGTd",
        "id": "2JvKtIooQt7Xkb3rUsQGTd",
        "is_local": false,
        "is_playable": true,
        "name": "Save Your Loving (For Me) - 2016 Remaster",
        "preview_url": "https://p.scdn.co/mp3-preview/fea862b238b7d6e1f107d599f7e853759686d364?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 5,
        "type": "track",
        "uri": "spotify:track:2JvKtIooQt7Xkb3rUsQGTd"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6x33CmZWo2Ve4hxYl2Craq"
            },
            "href": "https://api.spotify.com/v1/artists/6x33CmZWo2Ve4hxYl2Craq",
            "id": "6x33CmZWo2Ve4hxYl2Craq",
            "name": "Foghat",
            "type": "artist",
            "uri": "spotify:artist:6x33CmZWo2Ve4hxYl2Craq"
          }
        ],
        "disc_number": 1,
        "duration_ms": 236360,
        "explicit": true,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/69Y0RgF8KSNFth8UHZd9ee"
        },
        "href": "https://api.spotify.com/v1/tracks/69Y0RgF8KSNFth8UHZd9ee",
        "id": "69Y0RgF8KSNFth8UHZd9ee",
        "is_local": false,
        "is_playable": true,
        "name": "Drive Me Home - 2016 Remaster",
        "preview_url": "https://p.scdn.co/mp3-preview/4bfaaa92eebb59d766bc5bf3d493895264dc31d1?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 6,
        "type": "track",
        "uri": "spotify:track:69Y0RgF8KSNFth8UHZd9ee"
      },
      {
        "artists": [
          {
            "external_urls": {
              "spotify": "https://open.spotify.com/artist/6x33CmZWo2Ve4hxYl2Craq"
            },
            "href": "https://api.spotify.com/v1/artists/6x33CmZWo2Ve4hxYl2Craq",
            "id": "6x33CmZWo2Ve4hxYl2Craq",
            "name": "Foghat",
            "type": "artist",
            "uri": "spotify:artist:6x33CmZWo2Ve4hxYl2Craq"
          }
        ],
        "disc_number": 1,
        "duration_ms": 295826,
        "explicit": false,
        "external_urls": {
          "spotify": "https://open.spotify.com/track/2djeZQKv2pHAbVzhcIigVB"
        },
        "href": "https://api.spotify.com/v1/tracks/2djeZQKv2pHAbVzhcIigVB",
        "id": "2djeZQKv2pHAbVzhcIigVB",
        "is_local": false,
        "is_playable": true,
        "name": "Take It or Leave It - 2016 Remaster",
        "preview_url": "https://p.scdn.co/mp3-preview/f2c0c74d419fd2e397ff3e76b44dd5c673fe19b4?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 7,
        "type": "track",
        "uri": "spotify:track:2djeZQKv2pHAbVzhcIigVB"
      }
    ],
    "limit": 50,
    "next": null,
    "offset": 0,
    "previous": null,
    "total": 7
  },
  "type": "album",
  "uri": "spotify:album:6A5fIqkWcZEAuhZLf8bLAG"
}

export default Deck;