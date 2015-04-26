var Movie = require("../models/Movie");
var torrentService = require("../services/torrentService");
var _ = require("underscore");

var MovieService = require("../services/MovieService");

var movieService = new MovieService();

var api = {};

api.find = function* () {
  var options = this.query;
  this.body = yield movieService.find(options);
};

api.get = function* () {
  this.body = yield movieService.get(this.params.imdb);
};

api.download = function* () {
  var magnet = this.params.magnet;
  var movieId = this.params.id;
  this.body = yield torrentService.downloadMovie(movieId, magnet);
};

api.getYears = function* () {
  var years = yield Movie.getYears();
  this.body = _.pluck(years, "year");
};

api.getGenres = function* () {
  var genres = yield Movie.getGenres();
  this.body = _.pluck(genres, "genre");
};

api.torrents = function * () {
  var movieId = this.params.id;
  this.body = yield torrentService.findByMovie(movieId);
};

module.exports = api;