"use strict";

var TraktApiClient = require("./TraktApiClient");
var YtsApiClient = require("./YtsApiClient");
var _ = require("lodash");
var Joi = require("joi");
var Promise = require("bluebird");
var co = require("co");
var _ = require("lodash");

class MovieService {

  constructor() {
    this.traktApiClient = new TraktApiClient();
    this.ytsApiClient = new YtsApiClient();
  }

  *find(options) {
    var response = yield this.ytsApiClient.listMovies(options);
    var imdbCodes = _.pluck(response.data.movies, "imdb_code");
    var movies = yield this._getSummaries(imdbCodes);
    return movies;
  }
  
  get(imdbCode) {
    return co(function* () {
      return yield this.traktApiClient.movieSummary(imdbCode);
    }.bind(this));
  }

  _getSummaries(imdbCodes) {
    return Promise.map(imdbCodes, this.get.bind(this));
  }
  
}

module.exports = MovieService;