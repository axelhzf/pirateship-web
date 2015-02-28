"use strict";

var co = require("co");
var Movie = require("../models/Movie");
var Auth = require("../models/Auth");
var config = require("config");
var mrequest = require("./request");
var _ = require("underscore");
var imageService = require("./imageService");
var queue = require("../queue");
var Promise = require("bluebird");

var JOB_NAME = "trakt:fill-data-movie";
var JOB_PARALLEL = 20;

var request = require("co-request");
var barbakoa = require("barbakoa");

var TraktApiClient = require("./TraktApiClient");
var YtsApiClient = require("./YtsApiClient");

queue.addWorker(JOB_NAME, JOB_PARALLEL, function (data) {
  return co(function* () {
    var movieId = data.id;
    var movie = yield Movie.find(movieId);
    if (!movie) {
      throw new Error("Movie " + movieId + " doesn't exists");
    }
    if (!movie.imdb_id) {
      throw new Error("Movie " + movieId + " doesn't have imdb_id");
    }
    var apikey = config.get("trakt.apikey");
    var summary = yield mrequest.get("http://api.trakt.tv/movie/summary.json/" + apikey + "/" + movie.imdb_id);
    
    movie.tagline = summary.tagline;
    movie.trailer = summary.trailer;
    movie.overview = summary.overview;
    
    movie.poster = summary.images.poster;
    movie.poster_thumb = thumb(movie.poster);
    movie.background = summary.images.fanart;
    movie.background_thumb = thumb(movie.background);
    movie.watched = summary.watched;
    
    yield movie.save();
    
    console.log("imgserver downloadImagesForMovies with id ", movie.id);
  });
});

exports.fillDataFromMovie = function (movieId) {
  console.log("job create", JOB_NAME, movieId);
  return queue.addJob(JOB_NAME, {id: movieId});
};

function thumb(url) {
  if (url) {
    return url.replace(/original/, "thumb");
  }
}

var format = require("util").format;

var router = barbakoa.router;

var traktApiClient = new TraktApiClient();
var ytsApiClient = new YtsApiClient();

router.get("/movies", function * () {
  var response = yield traktApiClient.moviesPopular();
  var imdbCodes = response.map(function(movie) {
    return movie.ids.imdb;
  });
  var movies = yield summaries(imdbCodes);
  this.body = movies;
});

router.get("/movies/seeds", function* () {
  var response = yield ytsApiClient.listBySeeds();
  var imdbCodes = _.pluck(response.data.movies, "imdb_code");
  var movies = yield summaries(imdbCodes);
  this.body = movies;
});

function* summaries(imdbCodes) {
  var movies = [];
  for (var i = 0; i < imdbCodes.length; i++) {
    var imdbCode = imdbCodes[i];
    movies[i] = yield traktApiClient.movieSummary(imdbCode);
  }
  return movies;
}


router.get("/watched", function* () {
  var watched = yield traktApiClient.syncGetWatched();
  this.body = watched;
});

router.get("/history/add", function* () {
  var movies = yield traktApiClient.moviesPopular();
  var movie = movies[0];
  
  var response = yield traktApiClient.syncAddToHistory({movies: [movie]});
  this.body = response;
});

router.get("/history/remove", function* () {
  var movies = yield traktApiClient.moviesPopular();
  var movie = movies[0];

  var response = yield traktApiClient.syncRemoveFromHistory({movies: [movie]});
  this.body = response;
});

