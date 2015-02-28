"use strict";

var TraktApiClient = require("./TraktApiClient");
var YtsApiClient = require("./YtsApiClient");
var _ = require("lodash");

class MovieService {
 
  constructor() {
    this.traktApiClient = new TraktApiClient();
    this.ytsApiClient = new YtsApiClient();
  }
  
  *findPopular() {
    var response = yield this.traktApiClient.moviesPopular();
    var imdbCodes = response.map(function(movie) {
      return movie.ids.imdb;
    });
    var movies = yield this._getSummaries(imdbCodes);
    return movies;
  }
  
  *findBySeeds() {
    var response = yield this.ytsApiClient.listBySeeds();
    var imdbCodes = _.pluck(response.data.movies, "imdb_code");
    var movies = yield this._getSummaries(imdbCodes);
    return movies;
  }
  
  *get (imdbCode) {
    return yield this.traktApiClient.movieSummary(imdbCode)
  }

  *_getSummaries(imdbCodes) {
    var movies = [];
    for (var i = 0; i < imdbCodes.length; i++) {
      movies[i] = yield this.get(imdbCodes[i]);
    }
    return movies;
  }
  
}

module.exports = MovieService;