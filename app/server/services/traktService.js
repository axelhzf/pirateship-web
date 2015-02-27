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

var traktClient = new TraktApiClient();

router.get("/movies", function * () {
  var movies = yield traktClient.moviesPopular();
  
  for (var i = 0; i < movies.length; i++) {
    var movie = movies[i];
    movies[i] = yield traktClient.movieSummary(movie.ids.imdb);
  }
  
  this.body = movies;
});

router.get("/watched", function* () {
  var watched = yield traktClient.syncGetWatched();
  this.body = watched;
});

router.get("/history/add", function* () {
  var movies = yield traktClient.moviesPopular();
  var movie = movies[0];
  
  var response = yield traktClient.syncAddToHistory({movies: [movie]});
  this.body = response;
});

router.get("/history/remove", function* () {
  var movies = yield traktClient.moviesPopular();
  var movie = movies[0];

  var response = yield traktClient.syncRemoveFromHistory({movies: [movie]});
  this.body = response;
});

