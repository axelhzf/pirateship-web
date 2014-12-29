var Movie = require("../models/Movie");
var resource = require("./resource");
var moviesService = require("../services/moviesService");
var torrentService = require("../services/torrentService");
var _ = require("underscore");

var api = resource(Movie, {});

api.update = function * () {
  var featured = yield moviesService.fetchFeatured();
  this.body = featured;
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