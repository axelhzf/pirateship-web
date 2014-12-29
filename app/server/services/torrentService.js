var _ = require("underscore");
var Transmission = require("transmission");
var Promise = require("bluebird");
var pirateship = require("pirateship");
var Movie = require("../models/Movie");
var Download = require("../models/Download");

function TorrentService() {
  var transmissionOptions = {
    host: "localhost",
    port: 9091
  };
  this.transmission = new Transmission(transmissionOptions);

  this._addUrl = Promise.promisify(this.transmission.addUrl, this.transmission);
  this._get = Promise.promisify(this.transmission.get, this.transmission);

  this.start = Promise.promisify(this.transmission.start, this.transmission);
  this.stop = Promise.promisify(this.transmission.stop, this.transmission);
}

TorrentService.prototype = {

  find: Promise.promisify(pirateship.find, pirateship),

  findByMovie: function *(movieId) {
    var movie = yield Movie.find(movieId);
    if (!movie) {
      throw new Error("Movie not found");
    }
    var torrents = yield this.find(movie.title);
    return torrents;
  },

  download: function* (url) {
    var result = yield this._addUrl(url);
    return result;
  },

  downloadMovie: function* (movieId, url) {
    yield this.download(url);
    return yield Download.createFromMovie(movieId, url);
  },

  list: function* () {
    var response = yield this._get();
    var torrents = response.torrents;

    var hashes = _.pluck(torrents, "hashString");
    var downloads = yield Download.findAll({where: {hash: hashes}});
    downloads = _.indexBy(downloads, "hash");
    _.each(torrents, function (torrent) {
      var download = downloads[torrent.hashString];
      if (download) {
        torrent.movie = {
          id: downloads[torrent.hashString].movie_id
        };
      }
    });

    return torrents;
  }

};

module.exports = new TorrentService();